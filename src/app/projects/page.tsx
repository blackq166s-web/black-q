import { PagePlaceholder } from "@/components/page-placeholder";
import { ogImageUrl } from "@/lib/og";

export const metadata = {
  title: "Projects",
  description: "BlackQ 的工程项目集,从企业级 AI 部署到个人开源工具。",
  openGraph: {
    title: "Projects · BlackQ",
    description: "工程项目集,从企业级 AI 部署到个人开源工具。",
    images: [ogImageUrl({ title: "Projects", subtitle: "工程实践与开源作品" })],
  },
};

export default function ProjectsPage() {
  return (
    <PagePlaceholder
      title="Projects"
      subtitle="Engineering"
      description="我正在做和做过的工程项目,从企业级 AI 部署到个人开源工具。马上会陆续上架。"
    />
  );
}
