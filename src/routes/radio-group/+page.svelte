<script lang="ts">
	import { RadioGroup, Button } from '$lib/index.js';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { demoRow, card, code, lead, list, note, page, btn, kbd, h1, h2, h3 } from '../docs.js';

	let size = $state<string | undefined>(undefined);
	let submitted = $state('—');

	const anatomy = `<script>
  import { RadioGroup } from 'svbase';
<\/script>

<RadioGroup.Root name="size">
  <RadioGroup.Item value="s">Small</RadioGroup.Item>
  <RadioGroup.Item value="m">Medium</RadioGroup.Item>
  <RadioGroup.Item value="l">
    <RadioGroup.Indicator>●</RadioGroup.Indicator>
    Large
  </RadioGroup.Item>
</RadioGroup.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'value',
			type: 'string',
			defaultValue: '—',
			description: 'Selected value (controlled). String-only; form values are strings.'
		},
		{
			name: 'defaultValue',
			type: 'string',
			defaultValue: '—',
			description: 'Initially selected value for uncontrolled usage.'
		},
		{ name: 'name', type: 'string', defaultValue: '—', description: 'Form field name.' },
		{
			name: 'orientation',
			type: "'horizontal' | 'vertical'",
			defaultValue: "'horizontal'",
			description: 'Sets aria-orientation; all four arrows always work.'
		},
		{
			name: 'onValueChange',
			type: '(value: string) => void',
			defaultValue: '—',
			description: 'Fired with the next value on every selection.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Radio Group</h1>
	<p class={lead}>Single-select group with roving tabindex and arrow-key navigation.</p>

	<div class={card}>
		<RadioGroup.Root
			name="size"
			bind:value={size}
			onValueChange={(next) => {
				size = next;
			}}
		>
			<RadioGroup.Item value="s">Small</RadioGroup.Item>
			<RadioGroup.Item value="m" disabled>Medium (disabled)</RadioGroup.Item>
			<RadioGroup.Item value="l">
				<RadioGroup.Indicator>●</RadioGroup.Indicator>
				Large
			</RadioGroup.Item>
		</RadioGroup.Root>
		<p class={note}>
			Selected: {size ?? '—'} (Tab in, then use arrows — Medium is skipped, selection wraps)
		</p>
		<form
			class={demoRow}
			onsubmit={(event) => {
				event.preventDefault();
				submitted = String(new FormData(event.currentTarget).get('plan') ?? 'none');
			}}
		>
			<RadioGroup.Root name="plan" required>
				<RadioGroup.Item value="free">Free</RadioGroup.Item>
				<RadioGroup.Item value="pro">Pro</RadioGroup.Item>
			</RadioGroup.Root>
			<Button class={btn} type="submit">Submit (required blocks empty submit)</Button>
		</form>
		<p class={note}>Submitted plan: <code class={code}>{submitted}</code></p>
	</div>

	<div class={card}>
		<h3 class={h3}>Vertical</h3>
		<RadioGroup.Root name="align" orientation="vertical" defaultValue="left">
			<RadioGroup.Item value="left">Left</RadioGroup.Item>
			<RadioGroup.Item value="center">Center</RadioGroup.Item>
			<RadioGroup.Item value="right">Right</RadioGroup.Item>
		</RadioGroup.Root>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>RadioGroup.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>
			<span class={kbd}>←</span><span class={kbd}>→</span><span class={kbd}>↑</span><span
				class={kbd}>↓</span
			> move focus and select, skipping disabled items with wrap-around.
		</li>
		<li><span class={kbd}>Home</span> / <span class={kbd}>End</span> jump to the ends.</li>
		<li>Only the checked (or first enabled) item sits in the Tab order.</li>
	</ul>
</div>
