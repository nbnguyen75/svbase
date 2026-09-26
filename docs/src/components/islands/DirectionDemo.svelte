<script lang="ts">
	import { Direction, Tabs } from 'svbase';

	let value = $state('a');
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Direction.Root direction="rtl">
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
					class="border-b-2 border-transparent px-3 py-1.5 text-sm data-[state=active]:border-primary"
				>
					Gamma
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="a"><p>Panel A</p></Tabs.Content>
			<Tabs.Content value="b"><p>Panel B</p></Tabs.Content>
			<Tabs.Content value="c"><p>Panel C</p></Tabs.Content>
		</Tabs.Root>
	</Direction.Root>
	<p class="mt-3 text-sm text-muted-foreground">Selected: {value} (Tab in, then left arrow moves forward here)</p>
</div>
