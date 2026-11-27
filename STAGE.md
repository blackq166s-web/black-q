# 当前阶段

更新日期 2026-11-27（Asia/Shanghai）。

## 当前状态

- 正式站为 [black-q.com](https://black-q.com/)。本次仓库交接基于 `8e09dd1` 的静态站，`site/` 包含 37 个运行文件和 7 张作品卡片。「小型 AI 工作站选型台」已换用站点截图封面。
- 仓库已具备本地预览、按需刷新字库、生成 SHA-256 发布清单和校验内容的入口。启动与命令见 [README.md](README.md)。维护和回退见 [docs/summary.md](docs/summary.md)。
- 历史 Next.js 个人站保留供参考与回退。新工作以当前 `main` 的 `site/` 为起点。
- D 版窄体大写页脚见 [维护记录](docs/summary.md#d-版页脚)。本轮整站 P1 补齐关于我与作品的分享跳转，并调整手机窄屏和横屏首页。验证范围见 [整站 P1](docs/summary.md#整站-p1)。
- 标签页图标在 `work/site-shared-favicon` 本地统一，首页、同源报告及预览页共用双弧 Q。验证及回退见 [维护记录](docs/summary.md#主站标签页图标)。

## 下一步

1. 优先完善「AI 部署与测试」站内案例。有经确认可公开的实测图表或报告时，先核对测试条件、对比口径和个人贡献，再在 `site/content/projects.json` 的 `ai` 条目中补充 `sections`、`outcomes` 或 `resources`，将公开素材放入 `site/`。
2. 执行 `python tools/site.py package` 和 `python tools/site.py check`。预览「AI 与工程」分类，打开更新后的案例并核对资源和返回路径，再按授权验证 Vercel 预览和生产。
3. 如上述资料仍待确认，按 [维护记录](docs/summary.md#更新作品) 接入下一个已有四项材料的作品。整体首页调整由整体设计负责，定稿后单独核对发布范围。

## 阻塞与未验证

- AI 案例的实测图表、报告和公开范围待确认。真实手机、Safari、弱网和动效功耗待测。
- 历史校名已从相关分支历史移除。此前检查仍可通过旧提交直链读取残留内容，待由仓库维护者联系 GitHub Support。
