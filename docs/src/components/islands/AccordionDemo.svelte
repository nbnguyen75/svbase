<script lang="ts">
	import { Accordion } from 'svbase';

	let value = $state<Array<string>>(['a']);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
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
	<p class="mt-3 text-sm text-muted-foreground">
		Open: {value.length ? value.join(', ') : '—'} (Tab in, arrows move focus, Enter/Space toggles)
	</p>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>Multiple</h3>
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
