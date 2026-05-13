type ProgressCallback = (progress: number, step?: string) => void;

type MediaOutputFormat = "mp4" | "webm" | "mp3" | "wav" | "m4a" | "ogg" | "gif";

function extensionFromName(name: string, fallback: string) {
  return name.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() || fallback;
}

function outputName(inputName: string, suffix: string, format: MediaOutputFormat) {
  const base = inputName.replace(/\.[^/.]+$/, "") || "freeconvert-media";
  return `${base}-${suffix}.${format}`;
}

function asBytes(data: Uint8Array | string) {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }

  return data;
}

function bytesToBlobPart(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

function publicAssetURL(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}

async function runFFmpeg(
  file: File,
  outputFile: string,
  args: string[],
  mimeType: string,
  onProgress?: ProgressCallback,
) {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { fetchFile } = await import("@ffmpeg/util");
  const ffmpeg = new FFmpeg();
  const inputFile = `input.${extensionFromName(file.name, "mp4")}`;

  ffmpeg.on("progress", ({ progress }) => {
    if (Number.isFinite(progress)) {
      onProgress?.(Math.min(Math.max(progress * 100, 5), 95), "Processing media...");
    }
  });

  try {
    onProgress?.(5, "Loading media engine...");
    await ffmpeg.load({
      classWorkerURL: publicAssetURL("/ffmpeg/ffmpeg-worker.js"),
      coreURL: publicAssetURL("/ffmpeg/ffmpeg-core.js"),
      wasmURL: publicAssetURL("/ffmpeg/ffmpeg-core.wasm"),
    });
    onProgress?.(15, "Reading file...");
    await ffmpeg.writeFile(inputFile, await fetchFile(file));
    onProgress?.(25, "Converting...");
    const exitCode = await ffmpeg.exec(["-i", inputFile, ...args, outputFile], 180_000);

    if (exitCode !== 0) {
      throw new Error("The browser media engine could not process this file.");
    }

    const data = asBytes(await ffmpeg.readFile(outputFile));
    onProgress?.(100, "Media ready.");
    return new Blob([bytesToBlobPart(data)], { type: mimeType });
  } finally {
    ffmpeg.terminate();
  }
}

export async function compressVideo(
  file: File,
  opts: {
    format: "mp4" | "webm";
    crf: number;
    maxWidth: number;
    fps: number;
  },
  onProgress?: ProgressCallback,
) {
  const outputFile = `output.${opts.format}`;
  const videoFilters = [
    opts.maxWidth > 0 ? `scale='min(${opts.maxWidth},iw)':-2` : "",
    opts.fps > 0 ? `fps=${opts.fps}` : "",
  ].filter(Boolean);
  const args =
    opts.format === "webm"
      ? [
          ...(videoFilters.length ? ["-vf", videoFilters.join(",")] : []),
          "-c:v",
          "libvpx-vp9",
          "-crf",
          String(opts.crf),
          "-b:v",
          "0",
          "-c:a",
          "libopus",
          "-b:a",
          "96k",
        ]
      : [
          ...(videoFilters.length ? ["-vf", videoFilters.join(",")] : []),
          "-c:v",
          "libx264",
          "-preset",
          "veryfast",
          "-crf",
          String(opts.crf),
          "-c:a",
          "aac",
          "-b:a",
          "128k",
        ];

  return {
    blob: await runFFmpeg(
      file,
      outputFile,
      args,
      opts.format === "webm" ? "video/webm" : "video/mp4",
      onProgress,
    ),
    name: outputName(file.name, "compressed", opts.format),
  };
}

export async function videoToMP3(
  file: File,
  opts: { bitrate: number; start: number; duration: number },
  onProgress?: ProgressCallback,
) {
  const trimArgs = [
    opts.start > 0 ? ["-ss", String(opts.start)] : [],
    opts.duration > 0 ? ["-t", String(opts.duration)] : [],
  ].flat();
  const blob = await runFFmpeg(
    file,
    "output.mp3",
    [
      ...trimArgs,
      "-vn",
      "-codec:a",
      "libmp3lame",
      "-b:a",
      `${opts.bitrate}k`,
    ],
    "audio/mpeg",
    onProgress,
  );

  return { blob, name: outputName(file.name, "audio", "mp3") };
}

export async function videoToGIF(
  file: File,
  opts: { start: number; duration: number; width: number; fps: number },
  onProgress?: ProgressCallback,
) {
  const trimArgs = [
    opts.start > 0 ? ["-ss", String(opts.start)] : [],
    opts.duration > 0 ? ["-t", String(opts.duration)] : [],
  ].flat();
  const filter = `fps=${opts.fps},scale=${opts.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;
  const blob = await runFFmpeg(
    file,
    "output.gif",
    [...trimArgs, "-vf", filter, "-loop", "0"],
    "image/gif",
    onProgress,
  );

  return { blob, name: outputName(file.name, "clip", "gif") };
}

export async function convertAudio(
  file: File,
  opts: {
    format: "mp3" | "wav" | "m4a" | "ogg";
    bitrate: number;
    start: number;
    duration: number;
  },
  onProgress?: ProgressCallback,
) {
  const trimArgs = [
    opts.start > 0 ? ["-ss", String(opts.start)] : [],
    opts.duration > 0 ? ["-t", String(opts.duration)] : [],
  ].flat();
  const codecArgs = {
    mp3: ["-codec:a", "libmp3lame", "-b:a", `${opts.bitrate}k`],
    wav: ["-codec:a", "pcm_s16le"],
    m4a: ["-codec:a", "aac", "-b:a", `${opts.bitrate}k`],
    ogg: ["-codec:a", "libvorbis", "-b:a", `${opts.bitrate}k`],
  }[opts.format];
  const mimeType = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    ogg: "audio/ogg",
  }[opts.format];
  const blob = await runFFmpeg(
    file,
    `output.${opts.format}`,
    [...trimArgs, "-vn", ...codecArgs],
    mimeType,
    onProgress,
  );

  return { blob, name: outputName(file.name, "converted", opts.format) };
}
