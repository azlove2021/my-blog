---
title: 从 Fuwari 到 Vercel：小白搭建个人博客完整记录
published: 2026-06-21
updated: 2026-06-21
description: 从创建仓库、克隆项目、本地调试，到使用 Git 分支发布并验证 Vercel 自动部署，一步一步完成自己的 Fuwari 博客。
image: "./cover.jpeg"
tags: [Fuwari, Astro, Git, GitHub, Vercel, 博客搭建]
category: 建站教程
draft: false
lang: "zh_CN"
---

这篇文章记录我第一次把 Fuwari 改成自己的博客并发布到互联网的全过程。它不是一张只有命令的速查表：每一步都会说明在哪里执行、为什么要做，以及替代方法的优缺点。

最终网站地址是：[https://my-blog-xi-gilt.vercel.app/](https://my-blog-xi-gilt.vercel.app/)。

> [!important]
> 本文使用 Windows PowerShell。项目根目录是 `D:\AAA_Ai-Code\project-005-WebBlog\my-blog`。除非特别说明，所有 `git`、`pnpm` 命令都在这里执行。

## 先弄清楚整个流程

Fuwari 是一个基于 Astro 的静态博客模板。我们写 Markdown，Astro 把它构建成网页，GitHub 保存源文件，Vercel 读取 GitHub 的 `main` 分支并自动发布。

完整链路是：

```text
在本地修改文件
→ 本地开发服务器预览
→ 检查并生产构建
→ Git 工作分支提交
→ 合并进 main
→ 推送 main 到 GitHub
→ Vercel 自动构建
→ 打开正式网址验证
```

其中最容易混淆的一点是：**保存本地文件并不会更新网站，commit 也不会。只有 GitHub 上与 Vercel 连接的生产分支更新后，Vercel 才能收到新版本。**

## 一、准备工具

需要安装：

- Git：保存版本并连接 GitHub；
- Node.js 22 LTS：运行 Astro；
- pnpm 9：安装依赖和执行项目命令；
- VS Code：编辑代码和 Markdown。

安装后新开 PowerShell，逐行执行：

```powershell
git --version
node --version
pnpm --version
```

每条命令都应该输出版本号。若提示“不是内部或外部命令”，先关闭并重开终端，让新的环境变量生效。

## 二、从模板创建自己的 GitHub 仓库

1. 打开 [Fuwari 仓库](https://github.com/saicaca/fuwari)；
2. 点击 **Use this template → Create a new repository**；
3. Owner 选自己的 GitHub 账号；
4. Repository name 填 `my-blog`；
5. 创建仓库。

推荐使用模板，而不是直接 Fork。模板会生成一个更像“自己的新项目”的仓库；Fork 更适合持续向原项目贡献代码，但会保留明显的上下游关系。

## 三、明确目录和克隆位置

外层收纳目录是：

```text
D:\AAA_Ai-Code\project-005-WebBlog
```

它可以通过 PowerShell 创建，也可以在资源管理器中手动创建，两种结果完全一样。PowerShell 做法：

```powershell
New-Item -ItemType Directory -Force D:\AAA_Ai-Code\project-005-WebBlog
Set-Location D:\AAA_Ai-Code\project-005-WebBlog
Get-Location
```

这三行分别是创建目录、进入目录、确认当前目录。接着克隆：

```powershell
git clone https://github.com/azlove2021/my-blog.git
Set-Location .\my-blog
git rev-parse --show-toplevel
```

`git clone` 会在**当前目录**自动新建 `my-blog`，因此最终项目地址是：

```text
D:\AAA_Ai-Code\project-005-WebBlog\my-blog
```

`Set-Location .\my-blog` 必须在克隆成功后执行；它表示进入刚创建的子目录。以后每次新开终端，也先执行：

```powershell
Set-Location D:\AAA_Ai-Code\project-005-WebBlog\my-blog
```

### 克隆时出现 Connection reset 或 443 超时

我遇到过：

```text
Recv failure: Connection was reset
Failed to connect to github.com port 443
```

这表示 Git 到 GitHub 的 HTTPS 网络连接失败，不是仓库目录写错，也通常不是权限错误。浏览器能打开 GitHub，不代表 Git 一定使用了浏览器代理。

如果本机代理实际监听 `127.0.0.1:7897`，可以只为 GitHub 配置 Git 代理：

```powershell
git config --global http.https://github.com.proxy http://127.0.0.1:7897
git config --global --get http.https://github.com.proxy
git ls-remote https://github.com/azlove2021/my-blog.git HEAD
```

最后一条能返回 commit 哈希后，再重新克隆。端口必须以代理软件实际显示为准，不能盲抄 `7897`。若以后不用代理，删除配置：

```powershell
git config --global --unset http.https://github.com.proxy
```

全局配置的优点是以后克隆其他 GitHub 仓库也能复用；缺点是代理软件没启动时 GitHub 访问也会失败。只配置单个仓库影响更小，但新仓库仍需重复设置。

## 四、安装依赖并本地运行

确认提示符位于项目根目录，然后执行：

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

浏览器打开终端显示的地址，通常是 `http://localhost:4321/`。`pnpm dev` 会持续运行；结束时按 `Ctrl + C`。

为什么用 `--frozen-lockfile`：它严格按照仓库中的 `pnpm-lock.yaml` 安装，避免第一次安装就擅自升级依赖。普通 `pnpm install` 更灵活，但可能改写锁文件。

## 五、创建工作分支

先同步正式分支，再创建一条独立修改线：

```powershell
git switch main
git pull --ff-only
git status
git switch -c feature/setup-my-blog
git branch --show-current
```

最后应该输出 `feature/setup-my-blog`。分支名可以换成描述本次任务的英文短语。

分支的优点是修改失败时不立刻污染正式版本，也便于在 GitHub 查看差异；直接改 `main` 少几步，但每次推送都可能马上触发生产部署。

## 六、修改博客配置

主要配置在 `src/config.ts`。修改标题、副标题、导航、头像等信息时，先保持字段结构不变，只改字符串值。

本项目的语言代码应使用：

```ts
lang: "zh_CN"
```

不要写成 `zh-CN`。两者看起来接近，但 Fuwari 的类型定义使用下划线版本，写错会让 `pnpm check` 报错。

部署地址在 `astro.config.mjs`：

```js
site: "https://my-blog-xi-gilt.vercel.app/",
base: "/",
```

Vercel 站点部署在域名根目录，因此 `base` 保持 `/`。如果改用 GitHub Pages 的项目仓库地址，`base` 往往要改成 `/my-blog/`，不能直接照搬。

## 七、写文章与封面

推荐一篇文章一个文件夹：

```text
src/content/posts/my-blog/
├── index.md
└── cover.jpeg
```

`index.md` 的开头称为 Frontmatter：

```yaml
---
title: 从 Fuwari 到 Vercel：小白搭建个人博客完整记录
published: 2026-06-21
description: 一步一步搭建并发布自己的 Fuwari 博客。
image: "./cover.jpeg"
tags: [Fuwari, Astro, GitHub, Vercel]
category: 建站教程
draft: false
lang: "zh_CN"
---
```

封面与 `index.md` 相邻，所以写 `./cover.jpeg`。文件名大小写必须一致；Windows 本地可能不敏感，Linux 构建环境通常敏感。

`draft: true` 表示草稿，生产构建不会发布；准备上线时改为 `false`。

## 八、把演示文章隐藏但保留下来

不要把演示文章移入 `src/content/posts/temp`，因为它仍位于 Astro 的内容目录，可能继续被扫描。

推荐在项目根目录保存：

```text
temp/posts/
```

例如：

```powershell
New-Item -ItemType Directory -Force .\temp\posts
Move-Item .\src\content\posts\markdown.md .\temp\posts\
Move-Item .\src\content\posts\guide .\temp\posts\
```

文章文件夹要整体移动，避免正文与图片分离。恢复时反向执行：

```powershell
Move-Item .\temp\posts\markdown.md .\src\content\posts\
```

这种方式比永久删除更适合第一次建站：页面干净了，示例写法仍能从 `temp/posts` 找回，而且 Git 会保存这些文件。

## 九、本地调试和上线前门禁

边写边看：

```powershell
pnpm dev
```

准备发布时按 `Ctrl + C` 停止开发服务器，然后依次执行：

```powershell
pnpm check
pnpm type-check
pnpm build
pnpm preview
```

四者职责不同：

- `check`：检查 Astro、Svelte 与内容类型；
- `type-check`：检查 TypeScript；
- `build`：真正生成生产网站，是最重要的上线门槛；
- `preview`：用生产构建结果启动本地网站，发现只在构建后出现的问题。

不能只看首页能打开，还要检查文章页、封面、导航、深色模式、手机宽度和外链。`dev` 正常不等于生产构建一定正常。

## 十、检查、提交和合并

先看改了什么：

```powershell
git status
git diff
```

确认没有密码、API Key、`.env`、私人照片或不认识的文件，再提交：

```powershell
git add .
git status
git diff --cached
git commit -m "Publish Fuwari setup tutorial"
```

`git add` 是选择下一次快照，`git commit` 是在本地制作版本快照。两者都没有把文件发到 GitHub。

### 方法 A：GitHub Pull Request（推荐小白）

```powershell
git push -u origin feature/setup-my-blog
```

然后在 GitHub 点击 **Compare & pull request**，查看 Files changed，确认后合并进 `main`。最后同步本地：

```powershell
git switch main
git pull --ff-only
```

PR 多几步，但 GitHub 会把所有变化集中展示，最容易发现误提交。

### 方法 B：在本地合并

```powershell
git switch main
git pull --ff-only
git merge --no-ff feature/setup-my-blog
git push origin main
```

前三条只改变本机；最后一条才更新 GitHub 的 `main`。本地合并更快，适合个人项目，但少了一次网页上的可视化复核。

## 十一、Vercel 自动部署到底怎样工作

第一次部署：

1. 使用 GitHub 登录 Vercel；
2. 点击 **Add New → Project**；
3. 导入 `azlove2021/my-blog`；
4. Framework Preset 选择或自动识别 Astro；
5. Production Branch 设为 `main`；
6. 点击 Deploy。

仓库连接完成后：

- 推送工作分支通常生成 Preview Deployment；
- PR 合并到 `main`，或执行 `git push origin main`，会触发 Production Deployment；
- Vercel 状态为 **Building** 时继续等待；
- 状态为 **Ready** 后，正式网址才应该出现新内容；
- 状态为 **Error** 时查看构建日志，修复后重新提交，不要只反复点 Redeploy。

上线验证不能只检查 HTTP 200，因为旧版本也会返回 200。应打开新文章地址，确认能看到这篇文章的独特标题，同时确认演示文章已经不再显示。

## 十二、以后每次发文章的固定流程

```powershell
Set-Location D:\AAA_Ai-Code\project-005-WebBlog\my-blog
git switch main
git pull --ff-only
git switch -c post-new-article
pnpm new-post new-article
pnpm dev
```

写完后：

```powershell
pnpm check
pnpm type-check
pnpm build
git status
git diff
git add .
git diff --cached
git commit -m "Add article: 文章标题"
git push -u origin post-new-article
```

在 GitHub 合并 PR，再执行：

```powershell
git switch main
git pull --ff-only
git branch -d post-new-article
```

只有确认合并完成后才删除本地工作分支。普通写文章没有修改依赖，不必每次运行 `pnpm install`。

## 十三、上线出错如何回滚

先查看最近提交：

```powershell
git log --oneline -5
```

如果错误提交已经推送到 GitHub，优先创建一个撤销提交：

```powershell
git revert <需要撤销的提交哈希>
git push origin main
```

`git revert` 会保留完整历史，Vercel 也会根据新的 `main` 自动重新部署。不要把 `git reset --hard` 当作线上回滚按钮，它可能直接丢弃本地修改并改写历史。

## 最后的完成标准

一次发布只有同时满足以下条件才算完成：

- `pnpm check`、`pnpm type-check`、`pnpm build` 全部成功；
- GitHub 的 `main` 包含目标 commit；
- Vercel 对应部署状态是 **Ready**；
- 正式首页和新文章地址可以打开；
- 新标题和封面真实出现；
- 被移走的演示文章不再显示。

当这条链路第一次完整跑通，以后发文章就不再是一场玄学仪式，而是一套可以重复、可以检查、也可以回退的小流程。
