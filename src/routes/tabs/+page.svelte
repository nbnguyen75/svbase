<script lang="ts">
	import { Tabs } from '$lib/index.js';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { card, lead, list, note, page, kbd, h1, h2, h3 } from '../docs.js';

	let value = $state('a');

	const anatomy = `<script>
  import { Tabs } from 'svbase';
<\/script>

<Tabs.Root>
  <Tabs.List activation="automatic">
    <Tabs.Trigger value="a">Alpha</Tabs.Trigger>
    <Tabs.Trigger value="b">Beta</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="a">Panel A</Tabs.Content>
  <Tabs.Content value="b">Panel B</Tabs.Content>
</Tabs.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'value',
			type: 'string',
			defaultValue: '—',
			description: 'Selected tab value (controlled); undefined auto-selects first enabled.'
		},
		{
			name: 'defaultValue',
			type: 'string',
			defaultValue: '—',
			description: 'Initially selected value for uncontrolled usage.'
		},
		{
			name: 'orientation',
			type: "'horizontal' | 'vertical'",
			defaultValue: "'horizontal'",
			description: 'Arrow-key axis (Left/Right vs Up/Down).'
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
	<h1 class={h1}>Tabs</h1>
	<p class={lead}>Roving-tabindex tabs with automatic and manual activation.</p>

	<div class={card}>
		<Tabs.Root bind:value>
			<Tabs.List activation="automatic" class="flex gap-1 border-b">
				<Tabs.Trigger
					value="a"
					class="border-b-2 border-transparent px-3 py-1.5 text-sm data-[state=active]:border-primary"
				>
					Alpha
				</Tabs.Trigger>
				<Tabs.Trigger
					value="b"
					class="border-b-2 border-transparent px-3 py-1.5 text-sm data-[state=active]:border-primary"
				>
					Beta
				</Tabs.Trigger>
				<Tabs.Trigger
					value="c"
					disabled
					class="border-b-2 border-transparent px-3 py-1.5 text-sm data-[state=active]:border-primary"
				>
					Gamma
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="a"><p>Panel A</p></Tabs.Content>
			<Tabs.Content value="b"><p>Panel B</p></Tabs.Content>
			<Tabs.Content value="c"><p>Panel C</p></Tabs.Content>
		</Tabs.Root>
		<p class={note}>Selected: {value} (arrows select immediately in automatic mode)</p>
	</div>

	<div class={card}>
		<h3 class={h3}>Manual activation</h3>
		<Tabs.Root defaultValue="one">
			<Tabs.List>
				<Tabs.Trigger value="one">One</Tabs.Trigger>
				<Tabs.Trigger value="two">Two</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="one"><p>Panel One</p></Tabs.Content>
			<Tabs.Content value="two"><p>Panel Two</p></Tabs.Content>
		</Tabs.Root>
		<p class={note}>Arrows move focus only; Enter/Space/click selects.</p>
	</div>

	<div class={card}>
		<h3 class={h3}>Vertical</h3>
		<Tabs.Root orientation="vertical" defaultValue="up">
			<Tabs.List activation="automatic">
				<Tabs.Trigger value="up">Up</Tabs.Trigger>
				<Tabs.Trigger value="down">Down</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="up"><p>Up panel</p></Tabs.Content>
			<Tabs.Content value="down"><p>Down panel</p></Tabs.Content>
		</Tabs.Root>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Tabs.Root</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>Only the active (or focused) tab sits in the Tab order.</li>
		<li>Automatic mode selects on arrow move; manual mode selects on Enter/Space/click.</li>
		<li><span class={kbd}>Home</span> / <span class={kbd}>End</span> jump to the ends.</li>
	</ul>
</div>
