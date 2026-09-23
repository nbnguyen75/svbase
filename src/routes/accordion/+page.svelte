<script lang="ts">
	import { Accordion } from '$lib/index.js';

	let value = $state<Array<string>>(['a']);
</script>

<h1>Accordion</h1>
<p>Stacked collapsibles with arrow-key focus navigation.</p>

<section>
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
	<p>
		Open: {value.length ? value.join(', ') : '—'} (Tab in, arrows move focus, Enter/Space toggles)
	</p>
</section>

<section>
	<h2>Multiple</h2>
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
</section>
