import { ImageResponse } from "next/og";

export const alt = "FreeConvert - Free Online Image and PDF Tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f5f5fa",
          color: "#33333b",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: 64,
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#e5322d",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          FreeConvert.in
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1.02,
              maxWidth: 920,
            }}
          >
            Image and PDF tools. Zero uploads.
          </div>
          <div
            style={{
              color: "#707078",
              fontSize: 32,
              maxWidth: 800,
            }}
          >
            Resize, compress and convert images. Merge, split, rotate and
            watermark PDFs in your browser.
          </div>
        </div>
        <div
          style={{
            color: "#e5322d",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Private / Free / Client-side
        </div>
      </div>
    ),
    { ...size },
  );
}
