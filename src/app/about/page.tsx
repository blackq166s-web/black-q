import { PagePlaceholder } from "@/components/page-placeholder";
import { ogImageUrl } from "@/lib/og";

export const metadata = {
  title: "关于我",
  description: "我是 BlackQ,一名常驻长沙的 AI 工程师。白天交付企业级 AI 系统,晚上把它翻译成普通人能用的工具。",
  openGraph: {
    title: "关于我 · BlackQ",
    description: "白天交付企业级 AI 系统,晚上把它翻译成普通人能用的工具。",
    images: [ogImageUrl({ title: "我是 BlackQ", subtitle: "AI 工程师 · 内容创作者 · 摄影爱好者" })],
  },
};

export default function AboutPage() {
  return (
    <PagePlaceholder
      title="我是 BlackQ"
      subtitle="About"
      description="一名常驻长沙的 AI 工程师。白天交付企业级 AI 系统,晚上把它翻译成普通人能用的工具。这一页很快会写满我的故事、我的信念、和我正在走的路。"
    />
  );
}
