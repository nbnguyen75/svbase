<script lang="ts">
	import { Slider } from '$lib/index.js';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { card, code, lead, list, note, page, kbd, h1, h2, h3 } from '../docs.js';

	let volume = $state(30);
	let range = $state([20, 80]);

	const anatomy = `<script>
  import { Slider } from 'svbase';
<\/script>

<Slider.Root bind:value={volume}>
  <Slider.Track>
    <Slider.Thumb ariaLabel="Volume" />
  </Slider.Track>
</Slider.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'value',
			type: 'number | Array<number>',
			defaultValue: 'min',
			description: 'Single value or one per thumb, in order (controlled).'
		},
		{ name: 'min', type: 'number', defaultValue: '0', description: 'Range minimum.' },
		{ name: 'max', type: 'number', defaultValue: '100', description: 'Range maximum.' },
		{ name: 'step', type: 'number', defaultValue: '1', description: 'Value granularity.' },
		{
			name: 'orientation',
			type: "'horizontal' | 'vertical'",
			defaultValue: "'horizontal'",
			description: 'Axis and drag geometry.'
		},
		{
			name: 'onValueChange',
			type: '(value: number | Array<number>) => void',
			defaultValue: '—',
			description: 'Fired on every change (drag, keys).'
		},
		{
			name: 'onValueCommitted',
			type: '(value: number | Array<number>) => void',
			defaultValue: '—',
			description: 'Fired when a change commits (key press, drag release).'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Slider</h1>
	<p class={lead}>Single and range sliders with keyboard stepping and pointer drag.</p>

	<div class={card}>
		<Slider.Root bind:value={volume}>
			<Slider.Track style="width: 240px; height: 24px; position: relative;">
				<Slider.Thumb
					ariaLabel="Volume"
					class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background shadow"
				/>
			</Slider.Track>
		</Slider.Root>
		<p class={note}>Volume: {volume} (arrows ±1, PageUp/Down ±10, Home/End, or drag)</p>
	</div>

	<div class={card}>
		<h3 class={h3}>Range</h3>
		<Slider.Root bind:value={range} minStepsBetweenValues={5}>
			<Slider.Track style="width: 240px; height: 24px; position: relative;">
				<Slider.Thumb index={0} ariaLabel="Min price" />
				<Slider.Thumb index={1} ariaLabel="Max price" />
			</Slider.Track>
		</Slider.Root>
		<p class={note}>Range: {range.join(' – ')} (thumbs push with 5 minimum distance)</p>
	</div>

	<div class={card}>
		<h3 class={h3}>Vertical</h3>
		<Slider.Root orientation="vertical" defaultValue={40}>
			<Slider.Track style="width: 24px; height: 160px; position: relative;">
				<Slider.Thumb ariaLabel="Level" />
			</Slider.Track>
		</Slider.Root>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Slider.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>
			<span class={kbd}>←</span><span class={kbd}>→</span><span class={kbd}>↑</span><span
				class={kbd}>↓</span
			>
			step by <code class={code}>step</code>; <span class={kbd}>PgUp</span> /
			<span class={kbd}>PgDn</span> jump by <code class={code}>largeStep</code>.
		</li>
		<li><span class={kbd}>Home</span> / <span class={kbd}>End</span> jump to min/max.</li>
		<li>Each thumb is tabbable with full <code class={code}>aria-valuenow</code> contract.</li>
	</ul>
</div>
