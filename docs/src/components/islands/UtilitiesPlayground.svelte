<script lang="ts">
	import {
		composeHandlers,
		clickOutside,
		generateId,
		mergeProps,
		escapeKey,
		createId,
		Portal
	} from 'svbase';

	let portalOpen = $state(false);
	let dismissedBy = $state('none');
	let composedLog = $state<string[]>([]);
	let mergedLog = $state<string[]>([]);
	let sides: Array<{ note: string; id: string }> = $state([]);

	const demoId = createId('demo');
	const generated = generateId('demo');

	function addSide(note: string): void {
		sides = [...sides, { note, id: generateId('item') }];
	}

	const internalClick = (): void => {
		composedLog = [...composedLog, 'internal'];
	};
	const consumerClick = (): void => {
		composedLog = [...composedLog, 'consumer'];
	};
	const composed = composeHandlers<MouseEvent>(consumerClick, internalClick);

	interface DemoButtonProps {
		onclick: (event: MouseEvent) => void;
		class: string;
	}
	const mergedDemo: DemoButtonProps = mergeProps<DemoButtonProps>(
		{
			class: 'internal',
			onclick: () => {
				mergedLog = [...mergedLog, 'internal'];
			}
		},
		{
			class: 'consumer',
			onclick: () => {
				mergedLog = [...mergedLog, 'consumer'];
			}
		}
	);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>Portal</h3>
	<div class="flex flex-wrap items-center gap-3">
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (portalOpen = !portalOpen)}
		>
			Toggle portal content
		</button>
	</div>
	{#if portalOpen}
		<Portal>
			<p>This paragraph is teleported to <code>document.body</code>.</p>
		</Portal>
	{/if}
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>clickOutside + escapeKey</h3>
	<p class="mt-3 text-sm text-muted-foreground">Dismissed by: <strong>{dismissedBy}</strong></p>
	<div class="flex flex-wrap items-center gap-3">
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (dismissedBy = 'none')}
		>
			Reset
		</button>
	</div>
	<div
		role="dialog"
		aria-label="Dismissal demo"
		tabindex="-1"
		class="mt-3 rounded-lg border p-4"
		{@attach clickOutside(() => (dismissedBy = 'outside'))}
		{@attach escapeKey(() => (dismissedBy = 'escape'))}
	>
		<p class="mt-3 text-sm text-muted-foreground">
			Click outside this box or press Escape. Focus it first for keyboard testing.
		</p>
	</div>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>composeHandlers</h3>
	<div class="flex flex-wrap items-center gap-3">
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={composed}
		>
			Fire composed handlers
		</button>
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (composedLog = [])}
		>
			Clear
		</button>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">
		Call order: {composedLog.length ? composedLog.join(' → ') : '—'}
	</p>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>mergeProps</h3>
	<div class="flex flex-wrap items-center gap-3">
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={mergedDemo.onclick}
		>
			Fire merged props
		</button>
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (mergedLog = [])}
		>
			Clear
		</button>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">Merged class: <code>{mergedDemo.class}</code></p>
	<p class="mt-3 text-sm text-muted-foreground">
		Call order: {mergedLog.length ? mergedLog.join(' → ') : '—'}
	</p>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>generateId</h3>
	<div class="flex flex-wrap items-center gap-3">
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => addSide('new row')}
		>
			Add row
		</button>
	</div>
	<ul>
		{#each sides as side (side.id)}
			<li>{side.id}: {side.note}</li>
		{/each}
	</ul>
</div>

<p class="mt-3 text-sm text-muted-foreground">
	Demo id: <code>{demoId}</code> / <code>{generated}</code>
</p>
