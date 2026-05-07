import { PagePlaceholder } from "@/components/page-placeholder";
import { ogImageUrl } from "@/lib/og";

export const metadata = {
  title: "Writing",
  description: "BlackQ 的技术文章、AI 普惠教程和行业观察。",
  openGraph: {
    title: "Writing · BlackQ",
    description: "技术深度文 · AI 普惠教程 · 行业观察",
    images: [ogImageUrl({ title: "Writing", subtitle: "工程师视角与普通人视角的翻译" })],
  },
};

export default function WritingPage() {
  return (
    <PagePlaceholder
      title="Writing"
      subtitle="Notes & essays"
      description={`技术深度文、AI 普惠教程、行业观察。这里是我把"工程师视角"和"普通人视角"翻译给彼此的地方。`}
    />
  );
}
