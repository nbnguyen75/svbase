<script lang="ts">
	import { Button, Dialog } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import {
		btnOutline,
		demoRow,
		card,
		code,
		lead,
		list,
		note,
		page,
		btn,
		kbd,
		h1,
		h2,
		h3
	} from '../docs.js';

	let open = $state(false);

	const anatomy = `<script>
  import { Dialog } from 'svbase';
<\/script>

<Dialog.Root>
  <Dialog.Trigger>Open dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Confirm action</Dialog.Title>
      <Dialog.Description>This cannot be undone.</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'open',
			type: 'boolean',
			defaultValue: '—',
			description: 'Controlled open state. Omit for uncontrolled usage.'
		},
		{
			name: 'defaultOpen',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Initially open for uncontrolled usage.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Ignores interaction.'
		},
		{
			name: 'disablePointerDismissal',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Overlay clicks stop dismissing (Escape still closes).'
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
	<h1 class={h1}>Dialog</h1>
	<p class={lead}>Modal dialog with focus trap, scroll lock, and Escape dismissal.</p>

	<div class={card}>
		<Dialog.Root bind:open>
			<Dialog.Trigger class={btn}>Open dialog (currently {open ? 'open' : 'closed'})</Dialog.Trigger
			>
			<Dialog.Portal>
				<Dialog.Overlay class="fixed inset-0 bg-black/50" />
				<Dialog.Content
					class="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg"
				>
					<Dialog.Title class="text-lg font-semibold">Confirm action</Dialog.Title>
					<Dialog.Description class="text-sm text-muted-foreground">
						This cannot be undone.
					</Dialog.Description>
					<div class={demoRow}>
						<Button class={btnOutline}>Extra action</Button>
						<Dialog.Close class={btnOutline}>Close</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
		<p class={note}>Tab cycles inside while open; Escape closes and returns focus here.</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Dialog.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li><span class={kbd}>Tab</span> cycles focus inside the dialog (focus trap).</li>
		<li><span class={kbd}>Esc</span> closes and returns focus to the trigger.</li>
		<li>
			Initial focus lands on the first tabbable element. Style with
			<code class={code}>data-state="open"</code>.
		</li>
	</ul>
</div>
