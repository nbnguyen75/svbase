<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	interface TocItem {
		depth: number;
		id: string;
		text: string;
	}

	let items: Array<TocItem> = $state([]);

	function collect(): void {
		const article = document.querySelector('[data-docs-article]');
		if (!article) {
			items = [];
			return;
		}
		items = Array.from(article.querySelectorAll('h2[id], h3[id]')).map((el) => ({
			depth: el.tagName === 'H3' ? 3 : 2,
			id: el.id,
			text: el.textContent?.trim() ?? ''
		}));
	}

	onMount(() => {
		collect();
	});

	afterNavigate(() => {
		collect();
	});
</script>

<nav aria-label="On this page">
	<p class="pb-2 font-serif text-lg text-zinc-100">On this page</p>
	{#if items.length > 0}
		<ul class="space-y-1">
			{#each items as item (item.id)}
				<li class={item.depth === 3 ? 'ml-3' : ''}>
					<a
						href={`#${item.id}`}
						class="block rounded px-2 py-1 font-serif text-[15px] text-zinc-400 hover:text-zinc-100"
					>
						{item.text}
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="px-2 text-sm text-zinc-500">No sections.</p>
	{/if}
</nav>
