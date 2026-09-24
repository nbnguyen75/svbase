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

/** Minimal rehype plugin: id every h2/h3 so the docs "On this page" rail can link
 * to sections, and stamp Tailwind utility classes onto markdown-generated
 * elements so docs prose needs zero custom CSS. Raw-HTML demo blocks are
 * `raw` nodes, not elements, so component markup is never touched. */
function rehypeDocsChrome() {
	const classes: Record<string, string> = {
		h1: 'font-serif text-[2.75rem] leading-[1.1] tracking-[-0.01em] mb-4 scroll-mt-20',
		h2: 'mt-10 mb-4 text-2xl font-semibold tracking-tight scroll-mt-20',
		h3: 'mt-7 mb-3 text-xl font-semibold tracking-tight scroll-mt-20',
		p: 'mb-4 text-[0.95rem] leading-7 text-muted-foreground',
		lead: 'mb-8 text-xl leading-[1.6] text-muted-foreground',
		ul: 'mb-4 list-disc space-y-1 pl-6',
		ol: 'mb-4 list-decimal space-y-1 pl-6',
		li: 'text-[0.95rem] leading-7 text-muted-foreground',
		a: 'font-medium text-primary underline underline-offset-[3px]',
		code: 'rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.8em]',
		strong: 'font-bold text-foreground'
	};
	return (tree: HastNode): void => {
		let seenH1 = false;
		let leadDone = false;
		const visit = (node: HastNode, parentTag?: string): void => {
			if (node.type === 'element') {
				const tag = node.tagName ?? '';
				if (tag === 'h1') seenH1 = true;
				if ((tag === 'h2' || tag === 'h3') && collectText(node).length > 0) {
					node.properties = node.properties ?? {};
					node.properties.id = slugify(collectText(node));
				}
				const key = tag === 'p' && seenH1 && !leadDone ? 'lead' : tag;
				if (tag === 'p' && seenH1 && !leadDone) leadDone = true;
				// Never style code inside pre blocks (fenced source blocks keep their own chrome).
				if (Object.hasOwn(classes, key) && !(tag === 'code' && parentTag === 'pre')) {
					node.properties = node.properties ?? {};
					node.properties.className = classes[key];
				}
			}
			for (const child of node.children ?? [])
				visit(child, node.type === 'element' ? node.tagName : parentTag);
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
			preprocess: [mdsvex({ extensions: ['.svx', '.md'], rehypePlugins: [rehypeDocsChrome] })],
			extensions: ['.svelte', '.svx', '.md'],
			alias: {
				'@/*': './src/*'
			}
		})
	]
});
