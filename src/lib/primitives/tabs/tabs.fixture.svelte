<script lang="ts">
	import { Tabs } from '$lib/index.js';
</script>

<Tabs.Root>
	<Tabs.List activation="automatic">
		<Tabs.Trigger value="a">Alpha</Tabs.Trigger>
		<Tabs.Trigger value="b">Beta</Tabs.Trigger>
		<Tabs.Trigger value="c" disabled>Gamma</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="a"><p>Panel A</p></Tabs.Content>
	<Tabs.Content value="b"><p>Panel B</p></Tabs.Content>
	<Tabs.Content value="c"><p>Panel C</p></Tabs.Content>
</Tabs.Root>
<Tabs.Root>
	<Tabs.List>
		<Tabs.Trigger value="one">One</Tabs.Trigger>
		<Tabs.Trigger value="two">Two</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="one"><p>Panel One</p></Tabs.Content>
	<Tabs.Content value="two"><p>Panel Two</p></Tabs.Content>
</Tabs.Root>
<Tabs.Root orientation="vertical">
	<Tabs.List activation="automatic">
		<Tabs.Trigger value="up">Up tab</Tabs.Trigger>
		<Tabs.Trigger value="down">Down tab</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="up"><p>Up panel</p></Tabs.Content>
	<Tabs.Content value="down"><p>Down panel</p></Tabs.Content>
</Tabs.Root>
