<script lang="ts">
	import { Accordion } from '../../index.js';
</script>

<Accordion.Root>
	<Accordion.Item value="a">
		<Accordion.Header>
			<Accordion.Trigger>First</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel>
			<p>First panel</p>
		</Accordion.Panel>
	</Accordion.Item>
	<Accordion.Item value="b">
		<Accordion.Header>
			<Accordion.Trigger>Second</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel>
			<p>Second panel</p>
		</Accordion.Panel>
	</Accordion.Item>
	<Accordion.Item value="c" disabled>
		<Accordion.Header>
			<Accordion.Trigger>Third</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel>
			<p>Third panel</p>
		</Accordion.Panel>
	</Accordion.Item>
</Accordion.Root>
<Accordion.Root multiple>
	<Accordion.Item value="m1">
		<Accordion.Header>
			<Accordion.Trigger>Multi one</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel>
			<p>Multi one panel</p>
		</Accordion.Panel>
	</Accordion.Item>
	<Accordion.Item value="m2">
		<Accordion.Header>
			<Accordion.Trigger>Multi two</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel>
			<p>Multi two panel</p>
		</Accordion.Panel>
	</Accordion.Item>
</Accordion.Root>
