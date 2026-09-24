<script lang="ts">
	import { onMount } from 'svelte';

	import { cn } from './cn.js';

	interface Props {
		class?: string;
		lang?: string;
		code: string;
	}

	let { code, lang = 'svelte', class: className = '' }: Props = $props();

	let html: string | undefined = $state(undefined);

	onMount(async () => {
		const { codeToHtml } = await import('shiki');
		html = await codeToHtml(code, { lang, theme: 'github-light' });
	});
</script>

{#if html}
	<div
		class={cn(
			'[&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border [&>pre]:p-4 [&>pre]:text-[13px]',
			className
		)}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- shiki-escaped static strings authored in-repo, never user input -->
		{@html html}
	</div>
{:else}
	<pre
		class={cn(
			'overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-[13px]',
			className
		)}>{code}</pre>
{/if}
