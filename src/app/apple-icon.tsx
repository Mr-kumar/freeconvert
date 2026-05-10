import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e5322d",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 96,
            height: 96,
          }}
        >
          {/* Main Photo Frame */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 72,
              height: 72,
              border: "12px solid white",
              borderRadius: 20,
            }}
          />
          {/* Accent Element */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 48,
              height: 48,
              background: "#ffffff",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                background: "#e5322d",
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
