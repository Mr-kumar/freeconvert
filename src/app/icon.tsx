import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <div
          style={{
            width: 460,
            height: 460,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#e5322d",
            borderRadius: 100,
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 240,
              height: 240,
            }}
          >
            {/* Main Photo Frame */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 180,
                height: 180,
                border: "28px solid white",
                borderRadius: 48,
              }}
            />
            {/* Accent Element (representing edit/transform/magic) */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 120,
                height: 120,
                background: "#ffffff",
                borderRadius: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#e5322d",
                  borderRadius: 20,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
