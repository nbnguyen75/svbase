<script lang="ts">
	import { Collapsible } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { demoRow, card, code, lead, list, page, kbd, h1, h2, h3 } from '../docs.js';

	let controlledOpen = $state(false);

	const anatomy = `<script>
  import { Collapsible } from 'svbase';
<\/script>

<Collapsible.Root>
  <Collapsible.Trigger>Show more</Collapsible.Trigger>
  <Collapsible.Panel>
    Hidden details live here.
  </Collapsible.Panel>
</Collapsible.Root>`;

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
			name: 'disabled',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Ignores interaction.'
		},
		{
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			defaultValue: '—',
			description: 'Fired with the next state on every toggle.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Collapsible</h1>
	<p class={lead}>Expandable region with trigger, panel, and generated id linkage.</p>

	<div class={card}>
		<div class={demoRow}>
			<Collapsible.Root>
				<Collapsible.Trigger>Show more</Collapsible.Trigger>
				<Collapsible.Panel>
					<p>Hidden details live here.</p>
				</Collapsible.Panel>
			</Collapsible.Root>
			<Collapsible.Root bind:open={controlledOpen}>
				<Collapsible.Trigger>Controlled ({controlledOpen ? 'open' : 'closed'})</Collapsible.Trigger>
				<Collapsible.Panel>
					<p>Controlled panel content.</p>
				</Collapsible.Panel>
			</Collapsible.Root>
			<Collapsible.Root disabled>
				<Collapsible.Trigger>Disabled</Collapsible.Trigger>
				<Collapsible.Panel>
					<p>Never shown.</p>
				</Collapsible.Panel>
			</Collapsible.Root>
		</div>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Collapsible.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>
			The trigger is a button: <span class={kbd}>Enter</span> and
			<span class={kbd}>Space</span> toggle the panel.
		</li>
		<li>
			State surfaces as <code class={code}>data-state="open|closed"</code> on trigger and panel for styling.
		</li>
	</ul>
</div>
