import { PagePlaceholder } from "@/components/page-placeholder";
import { ogImageUrl } from "@/lib/og";

export const metadata = {
  title: "Now",
  description: "BlackQ 当前正在做什么。每隔几周更新一次。",
  openGraph: {
    title: "Now · BlackQ",
    description: "我此刻正在做什么。",
    images: [ogImageUrl({ title: "Now", subtitle: "BlackQ 此刻正在做什么" })],
  },
};

export default function NowPage() {
  return (
    <PagePlaceholder
      title="Now"
      subtitle="What I'm doing now"
      description={`灵感来自 nownownow.com——这一页只写"我此刻正在做什么"。每隔几周更新一次,让朋友和陌生人都能看到我正在哪条路上。`}
    />
  );
}
