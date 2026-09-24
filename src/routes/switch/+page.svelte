<script lang="ts">
	import { Switch } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { btnOutline, demoRow, card, lead, list, note, page, h1, h2, h3 } from '../docs.js';

	let switchChecked = $state(false);
	let switchChanges = $state<string[]>([]);

	const anatomy = `<script>
  import { Switch } from 'svbase';
<\/script>

<Switch.Root>
  <Switch.Thumb />
  Airplane mode
</Switch.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'checked',
			type: 'boolean',
			defaultValue: '—',
			description: 'Controlled on state. Omit for uncontrolled usage.'
		},
		{
			name: 'defaultChecked',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Initial state for uncontrolled usage.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Ignores interaction.'
		},
		{ name: 'name', type: 'string', defaultValue: '—', description: 'Form field name.' },
		{
			name: 'onCheckedChange',
			type: '(checked: boolean) => void',
			defaultValue: '—',
			description: 'Fired with the next state on every flip.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Switch</h1>
	<p class={lead}>Toggle switch with aria-checked and thumb.</p>

	<div class={card}>
		<div class={demoRow}>
			<Switch.Root
				bind:checked={switchChecked}
				onCheckedChange={(checked) => {
					switchChanges = [...switchChanges, checked ? 'on' : 'off'];
				}}
			>
				<Switch.Thumb />
				Airplane mode ({switchChecked ? 'on' : 'off'})
			</Switch.Root>
			<Switch.Root disabled>
				<Switch.Thumb />
				Disabled
			</Switch.Root>
		</div>
		<p class={note}>Changes: {switchChanges.length ? switchChanges.join(', ') : '—'}</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Switch.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>Enter and Space flip the switch; unlike checkbox, Enter toggles.</li>
	</ul>
</div>
