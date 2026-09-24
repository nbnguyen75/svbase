<script lang="ts">
	import { Select } from '$lib/index.js';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { card, code, lead, list, note, page, kbd, h1, h2, h3 } from '../docs.js';

	let fruit: string | null = $state(null);

	const anatomy = `<script>
  import { Select } from 'svbase';
<\/script>

<Select.Root name="fruit">
  <Select.Trigger aria-label="Fruit">
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'value',
			type: 'string | null',
			defaultValue: '—',
			description: 'Selected value, or null when empty (controlled).'
		},
		{
			name: 'name',
			type: 'string',
			defaultValue: '—',
			description: 'Form field name (hidden input syncs the value).'
		},
		{
			name: 'onValueChange',
			type: '(value: string | null) => void',
			defaultValue: '—',
			description: 'Fired with the next value on every selection.'
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
	<h1 class={h1}>Select</h1>
	<p class={lead}>Single-select dropdown with typeahead and form sync.</p>

	<div class={card}>
		<Select.Root name="fruit" bind:value={fruit}>
			<Select.Trigger aria-label="Fruit">
				<Select.Value placeholder="Pick a fruit" />
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
					<Select.Viewport>
						<Select.Item
							value="apple"
							class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
						>
							Apple
						</Select.Item>
						<Select.Item
							value="banana"
							class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
						>
							Banana
						</Select.Item>
						<Select.Item
							value="cherry"
							disabled
							class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
						>
							Cherry
						</Select.Item>
						<Select.Group>
							<Select.Label class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
								Citrus
							</Select.Label>
							<Select.Item
								value="orange"
								class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
							>
								Orange
							</Select.Item>
							<Select.Item
								value="lemon"
								class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
							>
								Lemon
							</Select.Item>
						</Select.Group>
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
		<p class={note}>
			Selected: {fruit ?? '—'} (Tab in, arrows select directly; Enter opens; type a letter to jump)
		</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Select.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>
			Closed trigger: <span class={kbd}>↑</span><span class={kbd}>↓</span> select directly;
			<span class={kbd}>Enter</span> opens and moves focus in; type to jump.
		</li>
		<li>
			Open list: arrows move highlight, <span class={kbd}>Enter</span> commits and closes,
			<span class={kbd}>Esc</span> closes and refocuses, <span class={kbd}>Tab</span> dismisses.
		</li>
		<li>
			Combobox triggers need an author-provided name (<code class={code}>aria-label</code>) — see
			the demo.
		</li>
	</ul>
</div>
