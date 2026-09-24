<script lang="ts">
	import { Tooltip } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { card, code, lead, list, note, page, kbd, h1, h2, h3 } from '../docs.js';

	const anatomy = `<script>
  import { Tooltip } from 'svbase';
<\/script>

<Tooltip.Root>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Content>Helpful hint</Tooltip.Content>
</Tooltip.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'open',
			type: 'boolean',
			defaultValue: '—',
			description: 'Controlled open state. Omit for uncontrolled usage.'
		},
		{
			name: 'placement',
			type: 'Placement',
			defaultValue: "'top'",
			description: 'Preferred placement; flips on viewport collision.'
		},
		{
			name: 'delay',
			type: 'number',
			defaultValue: '600',
			description: 'Hover open delay in ms. Focus opens immediately.'
		},
		{
			name: 'closeDelay',
			type: 'number',
			defaultValue: '0',
			description: 'Close delay in ms after pointer leave.'
		},
		{
			name: 'skipDelayDuration',
			type: 'number',
			defaultValue: '400',
			description: 'Opening skips the delay when another tooltip closed within this window.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Tooltip</h1>
	<p class={lead}>Hover/focus hint with delay and skip-delay across items.</p>

	<div class={card}>
		<Tooltip.Root>
			<Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
			<Tooltip.Content>Helpful hint with a 600ms hover delay.</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger delay={0}>Instant tooltip</Tooltip.Trigger>
			<Tooltip.Content>No delay on this one.</Tooltip.Content>
		</Tooltip.Root>
		<p class={note}>After closing one tooltip, the next opens instantly (400ms skip window).</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Tooltip.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>
			Focus opens immediately; <span class={kbd}>blur</span> and <span class={kbd}>Esc</span> close.
		</li>
		<li>
			Tooltips never take focus themselves — <code class={code}>role="tooltip"</code> content is
			announced via <code class={code}>aria-describedby</code>.
		</li>
	</ul>
</div>
