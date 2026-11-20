# Black Q — Projects & Play

[Black Q 的个人作品集](https://black-q.com/)包含首页、作品和关于我。作品页按分类展示项目，卡片链接到站内案例或独立项目站。当前主站用 HTML、CSS 和原生 JavaScript，内容来自 JSON，人像动效使用随站点提供的 Three.js。Vercel 直接托管静态文件。

## 目录

| 路径 | 用途 |
| --- | --- |
| `site/index.html`、`site/site.js`、`site/style.css` | 主站入口、路由和样式 |
| `site/content/projects.json` | 站点信息、作品与关于我图集 |
| `site/assets/`、`site/portrait/`、`site/projects/` | 封面、字体、人像动效和独立静态页面 |
| `tools/site.py`、`tools/typography/` | 内容校验、字体子集和发布清单生成 |
| `vercel.json`、`PORTFOLIO_MANIFEST.json` | Vercel 部署配置及 `site/` 文件的 SHA-256 清单 |
| `src/`、`public/`、根目录的 Node/pnpm 配置 | 前一版 Next.js 个人站源码和配置，保留供参考与回退 |

从 [STAGE.md](STAGE.md#下一步) 接手当前工作。[AGENTS.md](AGENTS.md) 记录接入与发布约定，[docs/summary.md](docs/summary.md) 记录部署与维护要点。

## 环境与安装

需要 Git、Python 3.11+ 和现代浏览器。本地运行及内容校验的依赖安装命令为「暂无」，Python 标准库即可运行。主站无需 Node.js、账号、数据库或环境变量。

```sh
git clone https://github.com/blackq166s-web/black-q.git
cd black-q
```

需要改文案或更新发布包时，安装字体构建依赖。可在独立 Python 虚拟环境中运行。首次需要新字形时，脚本会从 Google Fonts 的固定 Git 提交下载原字体并核对 SHA-256。

```sh
python -m pip install -r tools/typography/requirements.txt
```

## 启动

```sh
python -m http.server 4187 --bind 127.0.0.1 --directory site
```

打开 [本地首页](http://127.0.0.1:4187/#home)，端口被占用时，同时替换命令和浏览器地址中的端口。可用 `Ctrl+C` 停止服务。以 HTTP 打开站点，浏览器需要请求 JSON 和 JavaScript 模块。

## 构建与测试

```sh
python tools/site.py package
python tools/site.py check
```

`package` 检查作品配置，按需刷新 Noto Sans SC 子集和 `PORTFOLIO_MANIFEST.json`。发布目录为 `site/`。只刷新预览字库可运行 `python tools/site.py fonts`。清单覆盖 `site/` 中已跟踪及未被 Git 忽略的新文件。保存改动时一起提交站点文件和对应清单。

`check` 校验作品字段、站内文件、链接格式和运行文件摘要。浏览器冒烟检查可在 1280px 和 390px 宽度打开首页、作品、关于我，在作品页切换分类，进入一个站内案例并返回。涉及外链时另行打开核对目标。浏览器自动化测试命令暂无。

## 部署

手动部署命令暂无。现有 Vercel 项目通过 GitHub 集成部署。它读取 `vercel.json`，跳过依赖安装和构建，直接发布 `site/`。经授权推送非生产分支后可核对 Vercel 预览。经授权更新 `main` 会触发生产部署。部署完成后检查 [正式站](https://black-q.com/) 与涉及的页面或卡片。

## 作品接入

在 `site/content/projects.json` 维护名称、简介、分类、阶段、封面与点击目标。稳定的卡片 ID 可保留 `#project/<id>` 详情入口。独立静态项目可放在 `site/projects/<slug>/index.html`，随附依赖。单独发布或需要后端的项目可链接到其公开站点。字段和交付要求见[维护记录](docs/summary.md#更新作品)。
