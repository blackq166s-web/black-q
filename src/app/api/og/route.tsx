import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Bring AI to everyone.";
  const subtitle = searchParams.get("subtitle") ?? "让 AI 走进每个人的生活";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 顶部: Mission 标签 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#FF3B30",
            fontSize: "20px",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontSize: "16px" }}>◆</span>
          <span>Mission</span>
        </div>

        {/* 中间: 大字标题 + 副标题 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "#FAFAFA",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "950px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#737373",
              lineHeight: 1.4,
              maxWidth: "850px",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* 底部: 品牌标识 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "24px",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "#FAFAFA" }}>Black</span>
          <span style={{ color: "#FF3B30" }}>Q</span>
          <span style={{ color: "#737373" }}>.com</span>
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#FF3B30",
              borderRadius: "50%",
              marginLeft: "8px",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
