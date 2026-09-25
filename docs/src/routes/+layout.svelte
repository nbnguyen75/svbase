<script lang="ts">
	import type { Snippet } from 'svelte';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	import Toc from './Toc.svelte';

	import '@/assets/app.css';

	interface LayoutProps {
		children: Snippet;
	}

	let { children }: LayoutProps = $props();

	const primitives = [
		['accordion', 'Accordion'],
		['alert-dialog', 'Alert Dialog'],
		['avatar', 'Avatar'],
		['button', 'Button'],
		['checkbox', 'Checkbox'],
		['collapsible', 'Collapsible'],
		['combobox', 'Combobox'],
		['context-menu', 'Context Menu'],
		['dialog', 'Dialog'],
		['drawer', 'Drawer'],
		['dropdown-menu', 'Dropdown Menu'],
		['form', 'Form'],
		['menubar', 'Menubar'],
		['navigation-menu', 'Navigation Menu'],
		['number-field', 'Number Field'],
		['otp-field', 'OTP Field'],
		['popover', 'Popover'],
		['progress', 'Progress'],
		['radio-group', 'Radio Group'],
		['scroll-area', 'Scroll Area'],
		['select', 'Select'],
		['separator', 'Separator'],
		['slider', 'Slider'],
		['switch', 'Switch'],
		['tabs', 'Tabs'],
		['toast', 'Toast'],
		['toggle', 'Toggle'],
		['tooltip', 'Tooltip']
	] as const;

	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (q.length === 0) return primitives;
		return primitives.filter(
			([href, label]) => label.toLowerCase().includes(q) || href.includes(q)
		);
	});

	const isActive = (href: (typeof primitives)[number][0]): boolean =>
		page.url.pathname === `/${href}`;
	const isHome = $derived(page.url.pathname === '/');
</script>

<header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
	<div class="mx-auto flex h-14 w-full max-w-[1400px] items-center gap-4 px-4">
		<a href={resolve('/')} class="flex items-center gap-2.5">
			<span
				class="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-base font-bold text-white"
				>S</span
			>
			<span class="text-sm font-semibold tracking-[0.2em]">SVBASE</span>
		</a>
		<nav aria-label="Sections" class="flex items-center gap-1">
			<a
				href={resolve('/')}
				aria-current={isHome ? 'page' : undefined}
				class="rounded-md px-2.5 py-1.5 text-sm font-medium text-primary"
			>
				Docs
			</a>
		</nav>
		<div class="flex-1"></div>
		<input
			bind:value={query}
			type="search"
			placeholder="Filter primitives…"
			aria-label="Filter primitives"
			class="h-8 w-44 rounded-md border bg-white/5 px-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-primary/60 focus:outline-none sm:w-56"
		/>
	</div>
</header>

<div class="mx-auto flex w-full max-w-[1400px] gap-8 px-4">
	<aside
		class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto py-8 lg:block"
	>
		<nav aria-label="Documentation">
			<p class="px-3 pb-2 text-lg font-semibold text-zinc-100">Introduction</p>
			<a
				href={resolve('/')}
				aria-current={isHome ? 'page' : undefined}
				class="block rounded-md px-3 py-1.5 text-[15px] {isHome
					? 'text-primary'
					: 'text-zinc-400 hover:text-zinc-100'}"
			>
				Overview
			</a>
			<p class="px-3 pt-6 pb-2 text-lg font-semibold text-zinc-100">Primitives</p>
			{#each filtered as [href, label] (href)}
				<a
					href={`/${href}`}
					aria-current={isActive(href) ? 'page' : undefined}
					class="block rounded-md px-3 py-1.5 text-[15px] {isActive(href)
						? 'text-primary'
						: 'text-zinc-400 hover:text-zinc-100'}"
				>
					{label}
				</a>
			{/each}
			{#if filtered.length === 0}
				<p class="px-3 py-1.5 text-sm text-zinc-500">No primitives match.</p>
			{/if}
		</nav>
	</aside>
	<main class="min-w-0 flex-1 py-8">
		<article data-docs-article class="mx-auto w-full max-w-3xl min-w-0">
			{@render children()}
		</article>
	</main>
	<aside
		class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 xl:block"
	>
		<Toc />
	</aside>
</div>
