<script lang="ts">
	import { Button, Toast } from '$lib/index.js';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { demoRow, card, code, lead, list, note, page, btn, h1, h2, h3 } from '../docs.js';

	let count = $state(0);

	const anatomy = `<script>
  import { Toast } from 'svbase';
<\/script>

<Toast.Provider>
  <Toast.Viewport>
    <Toast.Root>
      <Toast.Title>Saved</Toast.Title>
      <Toast.Description>All changes saved.</Toast.Description>
      <Toast.Close>Dismiss</Toast.Close>
    </Toast.Root>
  </Toast.Viewport>
</Toast.Provider>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'duration',
			type: 'number',
			defaultValue: 'provider timeout (5000)',
			description: 'Auto-dismiss delay in ms. Non-finite values never auto-dismiss.'
		},
		{
			name: 'open / defaultOpen',
			type: 'boolean',
			defaultValue: 'true',
			description: 'Controlled / initial visibility. Rendered toasts show by default.'
		},
		{
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			defaultValue: '—',
			description: 'Fired with the next state on every open or close.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Toast</h1>
	<p class={lead}>Auto-dismissing notifications with swipe, pause-on-hover, and live regions.</p>

	<div class={card}>
		<div class={demoRow}>
			<Button
				class={btn}
				onclick={() => {
					count += 1;
				}}
			>
				Show toast ({count} shown)
			</Button>
		</div>
		<Toast.Provider>
			<Toast.Viewport class="fixed bottom-4 right-4 z-50 flex w-96 flex-col gap-2">
				{#each Array(count) as _, index (index)}
					<Toast.Root class="rounded-lg border bg-background p-4 shadow-lg">
						<Toast.Title class="text-sm font-semibold">Saved ({index + 1})</Toast.Title>
						<Toast.Description class="text-sm text-muted-foreground">
							All changes saved.
						</Toast.Description>
						<div class={demoRow}>
							<Toast.Action class={btn}>Undo</Toast.Action>
							<Toast.Close class={btn}>Dismiss</Toast.Close>
						</div>
					</Toast.Root>
				{/each}
			</Toast.Viewport>
		</Toast.Provider>
		<p class={note}>Hover a toast to pause its timer; swipe it sideways past 40px to dismiss.</p>
		<p class={note}>
			Each toast is <code class={code}>role="status"</code> — screen readers announce it, no live region
			wiring needed.
		</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Toast.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>Toasts never steal focus; inner buttons tab normally.</li>
		<li>Hover or focus pauses the auto-dismiss timer with remaining time preserved.</li>
	</ul>
</div>
