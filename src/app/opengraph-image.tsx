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
            alignItems: "center",
            display: "flex",
            gap: 22,
          }}
        >
          <svg
            height="72"
            viewBox="0 0 512 512"
            width="72"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="256" cy="256" fill="#008ee9" r="244" />
            <path
              d="M96 108h154l42 42v170H96V108Z"
              fill="#ffffff"
            />
            <path d="M250 108v42h42l-42-42Z" fill="#bde7ff" />
            <path
              d="M132 266h124l-41-54-32 38-22-25-29 41Zm36-88a24 24 0 1 0 0 48 24 24 0 0 0 0-48Z"
              fill="#0063a8"
            />
            <path
              d="M220 192h154l42 42v170H220V192Z"
              fill="#ffffff"
            />
            <path d="M374 192v42h42l-42-42Z" fill="#bde7ff" />
            <path
              d="M258 268h116v22H258v-22Zm0 52h116v22H258v-22Zm0 52h74v22h-74v-22Z"
              fill="#0063a8"
            />
            <path
              d="M308 114h72l56 56-56 56h-72v-44h54l12-12-12-12h-54v-44Zm-104 284h-72l-56-56 56-56h72v44h-54l-12 12 12 12h54v44Z"
              fill="#043b63"
            />
          </svg>
          <div
            style={{
              color: "#33333b",
              display: "flex",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            Free<span style={{ color: "#008ee9" }}>Convert</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.02,
              maxWidth: 920,
            }}
          >
            Image and PDF tools. No upload required.
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
            color: "#008ee9",
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
