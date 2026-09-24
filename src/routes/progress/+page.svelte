<script lang="ts">
	import { Progress, Button } from '$lib/index.js';

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
		h1,
		h2,
		h3
	} from '../docs.js';

	let value = $state(30);

	const anatomy = `<script>
  import { Progress } from 'svbase';
<\/script>

<Progress.Root value={30} ariaLabel="Upload progress">
  <Progress.Indicator />
</Progress.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'value',
			type: 'number',
			defaultValue: '—',
			description: 'Current value. Omit for an indeterminate bar (omits aria-valuenow).'
		},
		{ name: 'min', type: 'number', defaultValue: '0', description: 'Range minimum.' },
		{ name: 'max', type: 'number', defaultValue: '100', description: 'Range maximum.' },
		{
			name: 'format',
			type: '(value: number, max: number) => string',
			defaultValue: '—',
			description: 'Human-readable value for aria-valuetext (determinate only).'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Progress</h1>
	<p class={lead}>Determinate and indeterminate progress bars.</p>

	<div class={card}>
		<Progress.Root {value} ariaLabel="Upload progress">
			<Progress.Indicator class="h-2 rounded-full bg-primary" />
		</Progress.Root>
		<p class={note}>{value}%</p>
		<div class={demoRow}>
			<Button class={btnOutline} onclick={() => (value = Math.min(100, value + 10))}>+10</Button>
			<Button class={btnOutline} onclick={() => (value = 0)}>Reset</Button>
		</div>
	</div>

	<div class={card}>
		<h3 class={h3}>Indeterminate</h3>
		<Progress.Root ariaLabel="Loading">
			<Progress.Indicator class="h-2 rounded-full bg-primary" />
		</Progress.Root>
		<p class={note}>
			No value — animate <code class={code}>[data-state='indeterminate']</code> with CSS.
		</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Progress.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>None — progress bars are read-only indicators, never focusable.</li>
		<li>
			<code class={code}>data-state</code> is
			<code class={code}>indeterminate | progressing | complete</code>.
		</li>
	</ul>
</div>
