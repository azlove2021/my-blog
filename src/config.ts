import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "azlove2112",
	subtitle: "这是执笔绘倾城的第一个博客",
	lang: "zh_CN", // 网站语言代码，例如 "en"、"zh_CN"、"ja" 等。
	themeColor: {
		hue: 250, // 默认主题色色相，范围为 0~360；如红色为 0，青色为 200，蓝绿色为 250，粉色为 345
		fixed: false, // 是否固定主题色，避免访客切换颜色
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // 图片路径：相对于 /src；若以 "/" 开头，则表示相对于 /public
		position: "center", // 图片位置，等同于 CSS 的 object-position，仅支持 "top"、"center"、"bottom"
		credit: {
			enable: false, // 是否显示横幅图片的署名信息
			text: "", // 显示的署名文案
			url: "", // （可选）原作者或原作品页面的链接
		},
	},
	toc: {
		enable: true, // 是否在文章右侧显示目录
		depth: 2, // 目录最多显示到的标题层级，范围为 1~3
	},
	favicon: [
		// 将该数组留空即可使用默认 favicon
		// {
		//   src: '/favicon/icon.png',    // favicon 路径，相对于 /public
		//   theme: 'light',              // （可选）仅当浅色/深色模式需要不同图标时设置
		//   sizes: '32x32',              // （可选）仅当图标尺寸与默认值不同时设置
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/azlove2021/my-blog", // 内部链接无需手动拼接基础路径，系统会自动处理
			external: true, // 显示外部链接图标，并在新标签页中打开
		},
	],
};

// navBarConfig.links：导航栏；把演示 GitHub 地址改成你的地址；
// profileConfig.avatar：头像路径；
// profileConfig.name：昵称；
// profileConfig.bio：简介；
// profileConfig.links：社交链接，不需要的对象可以整段删除；
// licenseConfig：文章许可声明。

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.png", // 头像路径：相对于 /src；若以 "/" 开头，则表示相对于 /public
	name: "Lorem Ipsum",
	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	links: [
		{
			name: "X网站",
			icon: "fa6-brands:twitter", // 可前往 https://icones.js.org/ 查询图标代码
			// 如果项目尚未包含对应图标集，需要额外安装
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://x.com/",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/azlove2021/my-blog",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "wallhaven",
	url: "https://wallhaven.cc/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：某些样式（如背景色）可能会被覆盖，具体请查看 [astro.config.mjs](astro.config.mjs)。
	// 建议使用深色主题，因为当前博客主题主要针对深色背景进行适配。
	theme: "github-dark",
};
