const FFMessageType = {
  LOAD: "LOAD",
  EXEC: "EXEC",
  FFPROBE: "FFPROBE",
  WRITE_FILE: "WRITE_FILE",
  READ_FILE: "READ_FILE",
  DELETE_FILE: "DELETE_FILE",
  RENAME: "RENAME",
  CREATE_DIR: "CREATE_DIR",
  LIST_DIR: "LIST_DIR",
  DELETE_DIR: "DELETE_DIR",
  ERROR: "ERROR",
  DOWNLOAD: "DOWNLOAD",
  PROGRESS: "PROGRESS",
  LOG: "LOG",
  MOUNT: "MOUNT",
  UNMOUNT: "UNMOUNT",
};

const ERROR_UNKNOWN_MESSAGE_TYPE = new Error("unknown message type");
const ERROR_NOT_LOADED = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first");
const ERROR_IMPORT_FAILURE = new Error("failed to import ffmpeg-core.js");

let ffmpeg;

async function load({
  coreURL = "/ffmpeg/ffmpeg-core.js",
  wasmURL,
  workerURL,
}) {
  const first = !ffmpeg;
  const coreModule = await import(coreURL);
  const createFFmpegCore = coreModule.default || self.createFFmpegCore;

  if (!createFFmpegCore) {
    throw ERROR_IMPORT_FAILURE;
  }

  const resolvedWasmURL = wasmURL || coreURL.replace(/\.js$/g, ".wasm");
  const resolvedWorkerURL = workerURL || coreURL.replace(/\.js$/g, ".worker.js");

  ffmpeg = await createFFmpegCore({
    mainScriptUrlOrBlob: `${coreURL}#${btoa(
      JSON.stringify({
        wasmURL: resolvedWasmURL,
        workerURL: resolvedWorkerURL,
      }),
    )}`,
  });

  ffmpeg.setLogger((data) => {
    self.postMessage({ type: FFMessageType.LOG, data });
  });
  ffmpeg.setProgress((data) => {
    self.postMessage({ type: FFMessageType.PROGRESS, data });
  });

  return first;
}

function exec({ args, timeout = -1 }) {
  ffmpeg.setTimeout(timeout);
  ffmpeg.exec(...args);
  const ret = ffmpeg.ret;
  ffmpeg.reset();
  return ret;
}

function ffprobe({ args, timeout = -1 }) {
  ffmpeg.setTimeout(timeout);
  ffmpeg.ffprobe(...args);
  const ret = ffmpeg.ret;
  ffmpeg.reset();
  return ret;
}

function writeFile({ path, data }) {
  ffmpeg.FS.writeFile(path, data);
  return true;
}

function readFile({ path, encoding }) {
  return ffmpeg.FS.readFile(path, { encoding });
}

function deleteFile({ path }) {
  ffmpeg.FS.unlink(path);
  return true;
}

function rename({ oldPath, newPath }) {
  ffmpeg.FS.rename(oldPath, newPath);
  return true;
}

function createDir({ path }) {
  ffmpeg.FS.mkdir(path);
  return true;
}

function listDir({ path }) {
  const names = ffmpeg.FS.readdir(path);

  return names.map((name) => {
    const stat = ffmpeg.FS.stat(`${path}/${name}`);
    return {
      name,
      isDir: ffmpeg.FS.isDir(stat.mode),
    };
  });
}

function deleteDir({ path }) {
  ffmpeg.FS.rmdir(path);
  return true;
}

function mount({ fsType, options, mountPoint }) {
  const fs = ffmpeg.FS.filesystems[fsType];

  if (!fs) {
    return false;
  }

  ffmpeg.FS.mount(fs, options, mountPoint);
  return true;
}

function unmount({ mountPoint }) {
  ffmpeg.FS.unmount(mountPoint);
  return true;
}

self.onmessage = async ({ data: { id, type, data: payload } }) => {
  const transfer = [];
  let response;

  try {
    if (type !== FFMessageType.LOAD && !ffmpeg) {
      throw ERROR_NOT_LOADED;
    }

    switch (type) {
      case FFMessageType.LOAD:
        response = await load(payload);
        break;
      case FFMessageType.EXEC:
        response = exec(payload);
        break;
      case FFMessageType.FFPROBE:
        response = ffprobe(payload);
        break;
      case FFMessageType.WRITE_FILE:
        response = writeFile(payload);
        break;
      case FFMessageType.READ_FILE:
        response = readFile(payload);
        break;
      case FFMessageType.DELETE_FILE:
        response = deleteFile(payload);
        break;
      case FFMessageType.RENAME:
        response = rename(payload);
        break;
      case FFMessageType.CREATE_DIR:
        response = createDir(payload);
        break;
      case FFMessageType.LIST_DIR:
        response = listDir(payload);
        break;
      case FFMessageType.DELETE_DIR:
        response = deleteDir(payload);
        break;
      case FFMessageType.MOUNT:
        response = mount(payload);
        break;
      case FFMessageType.UNMOUNT:
        response = unmount(payload);
        break;
      default:
        throw ERROR_UNKNOWN_MESSAGE_TYPE;
    }
  } catch (error) {
    self.postMessage({
      id,
      type: FFMessageType.ERROR,
      data: error instanceof Error ? error.message : String(error),
    });
    return;
  }

  if (response instanceof Uint8Array) {
    transfer.push(response.buffer);
  }

  self.postMessage({ id, type, data: response }, transfer);
};
