<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<kbd
	class="inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[11px] font-medium whitespace-nowrap"
>
	{@render children()}
</kbd>
