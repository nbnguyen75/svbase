<script lang="ts">
	import { AlertDialog } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { card, lead, list, note, page, btn, kbd, h1, h2, h3 } from '../docs.js';

	const anatomy = `<script>
  import { AlertDialog } from 'svbase';
<\/script>

<AlertDialog.Root>
  <AlertDialog.Trigger>Delete item</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Delete item?</AlertDialog.Title>
      <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
      <AlertDialog.Close>Cancel</AlertDialog.Close>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>`;

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
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			defaultValue: '—',
			description: 'Fired with the next state on every open or close.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Alert Dialog</h1>
	<p class={lead}>Modal confirmation that ignores overlay clicks (Escape still closes).</p>

	<div class={card}>
		<AlertDialog.Root>
			<AlertDialog.Trigger class={btn}>Delete item</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay class="fixed inset-0 bg-black/50" />
				<AlertDialog.Content
					class="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg"
				>
					<AlertDialog.Title class="text-lg font-semibold">Delete item?</AlertDialog.Title>
					<AlertDialog.Description class="text-sm text-muted-foreground">
						This action cannot be undone.
					</AlertDialog.Description>
					<AlertDialog.Close class={btn}>Cancel</AlertDialog.Close>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>AlertDialog.Root</h3>
	<ApiTable props={rootProps} />
	<p class={note}>All other parts are re-exported from Dialog with identical props.</p>

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>Same focus trap as Dialog; <span class={kbd}>Esc</span> closes.</li>
		<li>Overlay clicks are ignored — destructive actions require an explicit choice.</li>
	</ul>
</div>
