<script lang="ts">
	import { Tabs } from '$lib/index.js';

	let value = $state('a');
</script>

<h1>Tabs</h1>
<p>Roving-tabindex tabs with automatic and manual activation.</p>

<section>
	<Tabs.Root bind:value>
		<Tabs.List activation="automatic">
			<Tabs.Trigger value="a">Alpha</Tabs.Trigger>
			<Tabs.Trigger value="b">Beta</Tabs.Trigger>
			<Tabs.Trigger value="c" disabled>Gamma</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="a"><p>Panel A</p></Tabs.Content>
		<Tabs.Content value="b"><p>Panel B</p></Tabs.Content>
		<Tabs.Content value="c"><p>Panel C</p></Tabs.Content>
	</Tabs.Root>
	<p>Selected: {value} (arrows select immediately in automatic mode)</p>
</section>

<section>
	<h2>Manual activation</h2>
	<Tabs.Root defaultValue="one">
		<Tabs.List>
			<Tabs.Trigger value="one">One</Tabs.Trigger>
			<Tabs.Trigger value="two">Two</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="one"><p>Panel One</p></Tabs.Content>
		<Tabs.Content value="two"><p>Panel Two</p></Tabs.Content>
	</Tabs.Root>
	<p>Arrows move focus only; Enter/Space/click selects.</p>
</section>

<section>
	<h2>Vertical</h2>
	<Tabs.Root orientation="vertical" defaultValue="up">
		<Tabs.List activation="automatic">
			<Tabs.Trigger value="up">Up</Tabs.Trigger>
			<Tabs.Trigger value="down">Down</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="up"><p>Up panel</p></Tabs.Content>
		<Tabs.Content value="down"><p>Down panel</p></Tabs.Content>
	</Tabs.Root>
</section>
