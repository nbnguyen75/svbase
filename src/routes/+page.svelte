<script lang="ts">
	import {
		clickOutside,
		composeHandlers,
		createId,
		escapeKey,
		generateId,
		mergeProps,
		Portal
	} from '$lib/index.js';

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

<h1>svbase — feat-002: Core Primitive Utilities</h1>
<p>Demo id: <code>{demoId}</code> / <code>{generated}</code></p>

<section>
	<h2>Portal</h2>
	<button onclick={() => (portalOpen = !portalOpen)}>Toggle portal content</button>
	{#if portalOpen}
		<Portal>
			<p data-testid="portal-content">
				This paragraph is teleported to <code>document.body</code>. Toggle it, then inspect the DOM.
			</p>
		</Portal>
	{/if}
</section>

<section>
	<h2>clickOutside + escapeKey</h2>
	<p>Dismissed by: <strong>{dismissedBy}</strong></p>
	<button onclick={() => (dismissedBy = 'none')}>Reset</button>
	<div
		role="dialog"
		aria-label="Dismissal demo"
		tabindex="-1"
		{@attach clickOutside(() => (dismissedBy = 'outside'))}
		{@attach escapeKey(() => (dismissedBy = 'escape'))}
	>
		<p>Click outside this box or press Escape. Focus it first for keyboard testing.</p>
	</div>
</section>

<section>
	<h2>composeHandlers</h2>
	<button onclick={composed}>Fire composed handlers</button>
	<button onclick={() => (composedLog = [])}>Clear</button>
	<p>Call order: {composedLog.length ? composedLog.join(' → ') : '—'}</p>
</section>

<section>
	<h2>mergeProps</h2>
	<button class={mergedDemo.class} onclick={mergedDemo.onclick}>Fire merged props</button>
	<button onclick={() => (mergedLog = [])}>Clear</button>
	<p>Merged class: <code>{mergedDemo.class}</code></p>
	<p>Call order: {mergedLog.length ? mergedLog.join(' → ') : '—'}</p>
</section>

<section>
	<h2>generateId</h2>
	<button onclick={() => addSide('new row')}>Add row</button>
	<ul>
		{#each sides as side (side.id)}
			<li>{side.id}: {side.note}</li>
		{/each}
	</ul>
</section>
