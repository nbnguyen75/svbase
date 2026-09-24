<script lang="ts">
	import { Popover, Button } from 'svbase';

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

	const anatomy = `<script>
  import { Popover } from 'svbase';
<\/script>

<Popover.Root>
  <Popover.Trigger>Options</Popover.Trigger>
  <Popover.Content>
    Popover body.
  </Popover.Content>
</Popover.Root>`;

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
			defaultValue: "'bottom'",
			description: 'Preferred placement; flips on viewport collision.'
		},
		{
			name: 'sideOffset',
			type: 'number',
			defaultValue: '0',
			description: 'Gap between trigger and content, in pixels.'
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
	<h1 class={h1}>Popover</h1>
	<p class={lead}>Anchored floating panel with flip-on-collision positioning.</p>

	<div class={card}>
		<div class={demoRow}>
			<Popover.Root>
				<Popover.Trigger class={btnOutline}>Options</Popover.Trigger>
				<Popover.Content class="rounded-lg border bg-popover p-4 text-popover-foreground shadow-md">
					<p>Popover body. Click outside or press Escape to dismiss.</p>
					<Button class={btn}>Inner action</Button>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>

	<div class={card}>
		<h3 class={h3}>With arrow and offset</h3>
		<Popover.Root sideOffset={8}>
			<Popover.Trigger class={btnOutline}>With arrow</Popover.Trigger>
			<Popover.Content class="rounded-lg border bg-popover p-4 text-popover-foreground shadow-md">
				<Popover.Arrow>◆</Popover.Arrow>
				<p>Arrow centers on the trigger edge.</p>
			</Popover.Content>
		</Popover.Root>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Popover.Root</h3>
	<ApiTable props={rootProps} />
	<p class={note}>
		Positioning runs on <code class={code}>@floating-ui/dom</code> (the sole runtime dependency
		besides Svelte); actual placement surfaces as <code class={code}>data-placement</code> for arrow styling.
	</p>

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>Trigger toggles on <span class={kbd}>Enter</span> / <span class={kbd}>Space</span>.</li>
		<li><span class={kbd}>Esc</span> closes; focus stays where it was (modeless).</li>
	</ul>
</div>
