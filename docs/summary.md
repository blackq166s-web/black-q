# 项目维护记录

2026-11-20。当前主站为 `site/` 下的静态站，共有 7 张作品卡片，涵盖软件与网站、AI 与工程、硬件与制作、游戏。主站由 Vercel 托管，主域为 `black-q.com`。前一版 Next.js 个人站保存在 `src/` 和 `public/`，也可通过标签 `before-portfolio-20261118` 找到。功能开发从 [STAGE.md](../STAGE.md) 接手。

## 更新作品

1. 收到子页面、封面、项目名与描述后，在 `site/content/projects.json` 中维护作品条目。按已确认的阶段和分类填写 `stage` 与 `category`，为 `cover` 填站点相对路径，为 `coverAlt` 填替代文本。沿用稳定的 `id`，用 `order` 调整顺序。
2. 点击目标使用 `targetUrl`，可为 `#project/<id>`、`projects/<slug>/index.html` 或已经确认公开的 HTTPS 地址。详情内容通过 `intro`、`contribution`、`sections`、`outcomes`、`limits`、`resources` 维护。设置 `published: false` 会从页面隐藏条目，JSON 仍可访问。
3. 涉及同步时记录来源仓库、提交、文件范围和本地定制。按 [README](../README.md#构建与测试) 刷新字库及清单，核对分类、封面、点击目标、返回路径与手机布局。

## 发布与回退

本轮交接基于 `8e09dd18ee1d4fffa27d9f5e441d7a635481a436`，该提交将「小型 AI 工作站选型台」卡片换为站点截图封面。上一版封面对应的发布基线为 `c0fcc4e7aeffb5b21cf522d840639ce3b93ec54a`。回退前确认目标版本的网页仍符合当前公开范围。可在 Vercel 使用已核对的历史部署，也可在当前 `main` 上提交恢复变更，完成预览后依授权发布。

## 待清理清单

| 对象 | 核对状态 |
| --- | --- |
| `site/assets/projects/compute-axis.webp` | 当前作品数据使用新版截图，旧封面仍在发布清单。删除前核对外部直链和回退用途。 |
| `site/assets/projects/small-ai-workstation-selector.webp` | 卡片已使用截图封面，原封面暂留。删除前核对外部直链和回退用途。 |
| 历史 Next.js 源码、`public/`、Node/pnpm 配置 | 已确认属于旧版个人站，保留供参考和回退。 |
| 本机 `_staging/`、`output/`、预览日志与字体下载缓存 | 属于工作资料或生成产物，保持忽略。 |

两个最大的历史文件是键盘三维预览 HTML（1.78 MiB）和 Three.js 模块（1.25 MiB），均用于当前站点，继续随站发布。

## 本轮验证

- Windows 干净克隆使用 Python 3.13.14，按 README 安装字体依赖、启动、打包和校验。7 张作品、37 个运行文件通过校验，逐个比对本地 HTTP 响应的 SHA-256。
- Edge 在 1280px 和 390px 核对首页、作品、关于我及作品分类、案例和返回路径。键盘三维预览文件通过静态资源校验，真实设备与性能仍待测。
- 临时克隆中验证了新增站点文件登记、忽略本地环境文件，以及新增中文字后重新生成字库。
- 使用 Gitleaks 检查工作树、远端分支和标签可达历史及此前已知的改写前提交。唯一告警经比对为封面文件的 SHA-256，未发现密钥。

## D 版页脚

2026-11-22。页脚采用窄体大写，优先使用系统 Arial Narrow Bold，回退到随站提供的 Archivo Narrow Bold。字库来自 [Google Fonts 固定提交](https://github.com/google/fonts/tree/06bfe0d62a98375cb09c942fa18e68bd32cff057/ofl/archivonarrow)，使用 FontTools 固定为 700 字重并保留 U+0020–007E、U+2018–2019。随站附带字体许可。发布基线为 `7b23a04`。如需回退，可恢复该部署或从最新 `main` 恢复本次涉及的页脚和字体资源。
