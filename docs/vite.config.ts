import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

interface HastNode {
	type: string;
	tagName?: string;
	properties?: Record<string, string | undefined>;
	children?: Array<HastNode>;
	value?: string;
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function collectText(node: HastNode): string {
	if (node.type === 'text') return node.value ?? '';
	return (node.children ?? []).map(collectText).join('');
}

/** Minimal rehype plugin: id every h2/h3 so the docs "On this page" rail can link to sections. */
function rehypeHeadingIds() {
	return (tree: HastNode): void => {
		const visit = (node: HastNode): void => {
			if (node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3')) {
				const text = collectText(node);
				if (text.length > 0) {
					node.properties = node.properties ?? {};
					node.properties.id = slugify(text);
				}
			}
			for (const child of node.children ?? []) visit(child);
		};
		visit(tree);
	};
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				// Pin the Vercel runtime so local builds don't depend on the
				// developer's Node major (adapter rejects Node 25+ at build time).
				runtime: 'nodejs22.x'
			}),
			preprocess: [mdsvex({ extensions: ['.svx', '.md'], rehypePlugins: [rehypeHeadingIds] })],
			extensions: ['.svelte', '.svx', '.md'],
			alias: {
				'@/*': './src/*'
			}
		})
	]
});
