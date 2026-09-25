<script lang="ts">
	import { onMount } from 'svelte';

	import { cn } from 'cn';

	interface Props {
		filename?: string;
		class?: string;
		lang?: string;
		code: string;
	}

	let { code, lang = 'svelte', filename = '', class: className = '' }: Props = $props();

	let html: string | undefined = $state(undefined);
	let copied = $state(false);

	onMount(async () => {
		const { codeToHtml } = await import('shiki');
		html = await codeToHtml(code, { lang, theme: 'github-dark' });
	});

	async function copy(): Promise<void> {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 1500);
		} catch {
			// Clipboard API unavailable — copy silently fails.
		}
	}
</script>

<div class={cn('overflow-hidden rounded-lg border bg-card', className)}>
	<div class="flex items-center justify-between border-b border-white/10 px-4 py-1.5">
		<span class="font-mono text-xs text-zinc-400">{filename}</span>
		<button
			onclick={copy}
			class="rounded px-2 py-1 font-mono text-xs text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>
	{#if html}
		<div class="[&>pre]:overflow-x-auto [&>pre]:bg-transparent! [&>pre]:p-4 [&>pre]:text-[13px]">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- shiki-escaped static strings authored in-repo, never user input -->
			{@html html}
		</div>
	{:else}
		<pre class="overflow-x-auto p-4 font-mono text-[13px] text-zinc-200">{code}</pre>
	{/if}
</div>
