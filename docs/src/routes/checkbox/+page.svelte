<script lang="ts">
	import { Checkbox, Button } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { demoRow, card, code, lead, list, note, page, btn, h1, h2, h3 } from '../docs.js';

	let checkboxChecked = $state(false);
	let submitted = $state('—');

	const anatomy = `<script>
  import { Checkbox } from 'svbase';
<\/script>

<Checkbox.Root>
  <Checkbox.Indicator>✓</Checkbox.Indicator>
  Subscribe
</Checkbox.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'checked',
			type: 'boolean',
			defaultValue: '—',
			description: 'Controlled ticked state. Omit for uncontrolled usage.'
		},
		{
			name: 'defaultChecked',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Initial state for uncontrolled usage.'
		},
		{
			name: 'indeterminate',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Mixed state: renders aria-checked="mixed". Clicking resolves to checked.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Ignores interaction.'
		},
		{
			name: 'readOnly',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Blocks ticking while staying focusable.'
		},
		{
			name: 'required',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Native form validation via the hidden input.'
		},
		{ name: 'name', type: 'string', defaultValue: '—', description: 'Form field name.' },
		{
			name: 'value',
			type: 'string',
			defaultValue: '"on"',
			description: 'Submitted value when checked.'
		},
		{
			name: 'uncheckedValue',
			type: 'string',
			defaultValue: '—',
			description: 'Submitted value when unchecked (nothing submits by default).'
		},
		{
			name: 'onCheckedChange',
			type: '(checked: boolean) => void',
			defaultValue: '—',
			description: 'Fired with the next state on every toggle.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Checkbox</h1>
	<p class={lead}>Accessible checkbox with indeterminate state and hidden form input.</p>

	<div class={card}>
		<div class={demoRow}>
			<Checkbox.Root
				onCheckedChange={(checked) => {
					checkboxChecked = checked;
				}}
			>
				<Checkbox.Indicator>✓</Checkbox.Indicator>
				Subscribe (uncontrolled)
			</Checkbox.Root>
			<Checkbox.Root indeterminate>
				<Checkbox.Indicator>✓</Checkbox.Indicator>
				Indeterminate
			</Checkbox.Root>
			<Checkbox.Root disabled>
				<Checkbox.Indicator>✓</Checkbox.Indicator>
				Disabled
			</Checkbox.Root>
			<Checkbox.Root readOnly checked>
				<Checkbox.Indicator>✓</Checkbox.Indicator>
				Read-only
			</Checkbox.Root>
		</div>
		<p class={note}>Last change: {checkboxChecked ? 'checked' : 'unchecked'}</p>
		<form
			class={demoRow}
			onsubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				submitted = `agree=${data.get('agree')} newsletter=${data.get('newsletter')}`;
			}}
		>
			<Checkbox.Root name="agree" value="yes">
				<Checkbox.Indicator>✓</Checkbox.Indicator>
				Agree (required)
			</Checkbox.Root>
			<Checkbox.Root name="newsletter" value="yes" uncheckedValue="no">
				<Checkbox.Indicator>✓</Checkbox.Indicator>
				Newsletter (unchecked submits "no")
			</Checkbox.Root>
			<Button class={btn} type="submit">Submit form</Button>
		</form>
		<p class={note}>Submitted: <code class={code}>{submitted}</code></p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Checkbox.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>Space toggles when the box is focused; Enter never toggles (it submits the form).</li>
		<li>
			Associated <code class={code}>&lt;label&gt;</code> elements toggle via the hidden input.
		</li>
	</ul>
</div>
