<script lang="ts">
	import { Accordion } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { demoRow, card, lead, list, note, page, kbd, h1, h2, h3 } from '../docs.js';

	let value = $state<Array<string>>(['a']);

	const anatomy = `<script>
  import { Accordion } from 'svbase';
<\/script>

<Accordion.Root>
  <Accordion.Item value="a">
    <Accordion.Header>
      <Accordion.Trigger>First</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      First panel content.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'value',
			type: 'Array<string>',
			defaultValue: '—',
			description: 'Open item values (controlled).'
		},
		{
			name: 'defaultValue',
			type: 'Array<string>',
			defaultValue: '[]',
			description: 'Initially open values for uncontrolled usage.'
		},
		{
			name: 'multiple',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Whether several items may be open at once.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Ignores interaction.'
		},
		{
			name: 'onValueChange',
			type: '(value: Array<string>) => void',
			defaultValue: '—',
			description: 'Fired with the next value on every toggle.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Accordion</h1>
	<p class={lead}>Stacked collapsibles with arrow-key focus navigation.</p>

	<div class={card}>
		<Accordion.Root bind:value>
			<Accordion.Item value="a">
				<Accordion.Header>
					<Accordion.Trigger>First</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p>First panel content.</p>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="b">
				<Accordion.Header>
					<Accordion.Trigger>Second</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p>Second panel content.</p>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="c" disabled>
				<Accordion.Header>
					<Accordion.Trigger>Third (disabled)</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p>Never shown.</p>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
		<p class={note}>
			Open: {value.length ? value.join(', ') : '—'} (Tab in, arrows move focus, Enter/Space toggles)
		</p>
	</div>

	<div class={card}>
		<h3 class={h3}>Multiple</h3>
		<Accordion.Root multiple defaultValue={['x']}>
			<Accordion.Item value="x">
				<Accordion.Header>
					<Accordion.Trigger>Ex one</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p>Ex one panel.</p>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="y">
				<Accordion.Header>
					<Accordion.Trigger>Ex two</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<p>Ex two panel.</p>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Accordion.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>
			<span class={kbd}>↑</span><span class={kbd}>↓</span> move focus between triggers without
			opening;
			<span class={kbd}>Home</span> / <span class={kbd}>End</span> jump to the ends.
		</li>
		<li>
			<span class={kbd}>Enter</span> and <span class={kbd}>Space</span> toggle the focused item.
		</li>
	</ul>
</div>
