<script lang="ts">
	import type { Snippet } from 'svelte';

	import { resolve } from '$app/paths';

	import '@/assets/app.css';

	interface LayoutProps {
		children: Snippet;
	}

	let { children }: LayoutProps = $props();

	const links = [
		['button', 'Button'],
		['toggle', 'Toggle'],
		['checkbox', 'Checkbox'],
		['radio-group', 'Radio Group'],
		['collapsible', 'Collapsible'],
		['accordion', 'Accordion'],
		['dialog', 'Dialog'],
		['alert-dialog', 'Alert Dialog'],
		['popover', 'Popover'],
		['tooltip', 'Tooltip'],
		['dropdown-menu', 'Dropdown Menu'],
		['tabs', 'Tabs'],
		['slider', 'Slider'],
		['progress', 'Progress'],
		['select', 'Select'],
		['separator', 'Separator'],
		['scroll-area', 'Scroll Area'],
		['toast', 'Toast'],
		['switch', 'Switch']
	] as const;
</script>

<header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
	<div class="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4">
		<a href={resolve('/')} class="text-sm font-semibold tracking-tight">svbase</a>
		<nav aria-label="Primitives" class="flex flex-1 items-center gap-1 overflow-x-auto">
			{#each links as [href, label] (href)}
				<a
					href={resolve(`/${href}`)}
					class="rounded-md px-2.5 py-1.5 text-[13px] whitespace-nowrap text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					{label}
				</a>
			{/each}
		</nav>
	</div>
</header>
<main>
	{@render children()}
</main>
