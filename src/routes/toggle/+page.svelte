<script lang="ts">
	import { Toggle } from '$lib/index.js';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { btnOutline, demoRow, card, lead, list, note, page, btn, h1, h2, h3 } from '../docs.js';

	let toggleChanges = $state<string[]>([]);
	let controlledPressed = $state(false);

	const anatomy = `<script>
  import { Toggle } from 'svbase';
<\/script>

<Toggle aria-label="Mute">M</Toggle>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'pressed',
			type: 'boolean',
			defaultValue: '—',
			description: 'Controlled pressed state. Omit for uncontrolled usage.'
		},
		{
			name: 'defaultPressed',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Initial state for uncontrolled usage.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Whether user interaction is ignored.'
		},
		{
			name: 'element',
			type: 'string',
			defaultValue: "'button'",
			description: 'Underlying element tag, forwarded to Button.'
		},
		{
			name: 'onPressedChange',
			type: '(pressed: boolean) => void',
			defaultValue: '—',
			description: 'Fired with the next state whenever the toggle is activated.'
		},
		{
			name: 'ref',
			type: 'HTMLElement',
			defaultValue: '—',
			description: 'Two-way bound access to the underlying DOM element.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Toggle</h1>
	<p class={lead}>Two-state button with aria-pressed.</p>

	<div class={card}>
		<div class={demoRow}>
			<Toggle
				class={btnOutline}
				onPressedChange={(pressed) => {
					toggleChanges = [...toggleChanges, pressed ? 'on' : 'off'];
				}}
			>
				Uncontrolled toggle
			</Toggle>
			<Toggle class={btnOutline} bind:pressed={controlledPressed}>
				Controlled: {controlledPressed ? 'on' : 'off'}
			</Toggle>
			<Toggle class={btnOutline} disabled>Disabled toggle</Toggle>
		</div>
		<p class={note}>Changes: {toggleChanges.length ? toggleChanges.join(', ') : '—'}</p>
		<p class={note}>
			State surfaces as <code>aria-pressed</code> plus <code>data-pressed</code> for styling.
		</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Toggle</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>Enter and Space toggle the pressed state.</li>
		<li>A consumer onclick calling preventDefault vetoes the flip.</li>
	</ul>
</div>
