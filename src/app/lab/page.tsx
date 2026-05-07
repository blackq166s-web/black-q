import { PagePlaceholder } from "@/components/page-placeholder";
import { ogImageUrl } from "@/lib/og";

export const metadata = {
  title: "Lab",
  description: "BlackQ 的 AI 工具实验场。第一个工具是「旅游方案制定」,给爸妈适老模式,给孩子带娃模式。",
  openGraph: {
    title: "Lab · BlackQ",
    description: "AI 工具实验场,让普通人也能用上 AI。",
    images: [ogImageUrl({ title: "AI Lab", subtitle: "给爸妈和孩子的 AI 工具" })],
  },
};

export default function LabPage() {
  return (
    <PagePlaceholder
      title="AI Lab"
      subtitle="Tools for everyone"
      description="这里是我做的 AI 工具实验场。第一个工具是「旅游方案制定」——你输入目的地和喜好,AI 给你一份能直接执行的行程,包括给爸妈的适老模式和给孩子的带娃模式。"
    />
  );
}
