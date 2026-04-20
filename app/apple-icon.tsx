import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050505",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00C853 0%, #FFD54F 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 100,
            fontWeight: 900,
            color: "#050505",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.04em",
            boxShadow: "0 0 40px rgba(0,200,83,0.35)",
          }}
        >
          C
        </div>
      </div>
    ),
    size,
  );
}
