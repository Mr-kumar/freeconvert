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
          alignItems: "center",
          background: "#ffffff",
          color: "#e5322d",
          display: "flex",
          fontSize: 168,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        FC
      </div>
    ),
    { ...size },
  );
}
