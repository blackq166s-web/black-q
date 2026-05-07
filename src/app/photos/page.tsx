import { PagePlaceholder } from "@/components/page-placeholder";
import { ogImageUrl } from "@/lib/og";

export const metadata = {
  title: "Photos",
  description: "BlackQ 的摄影、Cos、Vlog 截帧和 AI 影像作品。",
  openGraph: {
    title: "Photos · BlackQ",
    description: "摄影 · Cos · Vlog · AI 影像",
    images: [ogImageUrl({ title: "Photos", subtitle: "用影像记录,用代码创造" })],
  },
};

export default function PhotosPage() {
  return (
    <PagePlaceholder
      title="Photos"
      subtitle="Visual"
      description="摄影、Cos、Vlog 截帧、AI 影像。我相信代码和影像是同一种创造力的两种语言。"
    />
  );
}
