<script lang="ts">
	import { Direction, Tabs } from '../../index.js';

	let value = $state('a');
</script>

<Direction.Root direction="rtl">
	<Tabs.Root bind:value>
		<Tabs.List activation="automatic">
			<Tabs.Trigger value="a">Alpha</Tabs.Trigger>
			<Tabs.Trigger value="b">Beta</Tabs.Trigger>
			<Tabs.Trigger value="c">Gamma</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="a"><p>Panel A</p></Tabs.Content>
		<Tabs.Content value="b"><p>Panel B</p></Tabs.Content>
		<Tabs.Content value="c"><p>Panel C</p></Tabs.Content>
	</Tabs.Root>
</Direction.Root>
<p>Selected: {value}</p>
