/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a GitHub repository link card without calling the GitHub API.
 * Keeping the card static avoids anonymous API rate limits and ensures that
 * repository links remain usable even when GitHub metadata is unavailable.
 * Rate limit reference:
 * https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("github" directive must be leaf type "::github{repo=\"owner/repo\"}")',
		]);

	if (
		typeof properties.repo !== "string" ||
		!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(properties.repo)
	)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attribute must be in the format "owner/repo")',
		);

	const repo = properties.repo;
	const [owner, repository] = repo.split("/");

	const title = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				h("div", { class: "gc-user" }, owner),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, repository),
	]),
		h("div", { class: "github-logo" }),
	]);

	const description = h(
		"div",
		{ class: "gc-description" },
		`在 GitHub 上查看 ${repo} 的源代码、提交记录和最新信息。`,
	);

	return h(
		"a",
		{
			class: "card-github no-styling",
			href: `https://github.com/${repo}`,
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": `在 GitHub 上打开 ${repo}`,
			repo,
		},
		[title, description],
	);
}
