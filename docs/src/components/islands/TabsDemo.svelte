<script lang="ts">
	import { Tabs } from 'svbase';

	import { tabsTrigger, tabsList, card, hint } from '../demo.js';

	let value = $state('a');
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
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
	<p class="mt-3 text-sm text-muted-foreground">
		Selected: {value} (arrows select immediately in automatic mode)
	</p>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>Manual activation</h3>
	<Tabs.Root defaultValue="one">
		<Tabs.List class={tabsList}>
			<Tabs.Trigger value="one" class={tabsTrigger}>One</Tabs.Trigger>
			<Tabs.Trigger value="two" class={tabsTrigger}>Two</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="one"><p>Panel One</p></Tabs.Content>
		<Tabs.Content value="two"><p>Panel Two</p></Tabs.Content>
	</Tabs.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Arrows move focus only; Enter/Space/click selects.
	</p>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>Vertical</h3>
	<Tabs.Root orientation="vertical" defaultValue="up">
		<Tabs.List activation="automatic" class="{tabsList} flex-col">
			<Tabs.Trigger value="up" class={tabsTrigger}>Up</Tabs.Trigger>
			<Tabs.Trigger value="down" class={tabsTrigger}>Down</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="up"><p>Up panel</p></Tabs.Content>
		<Tabs.Content value="down"><p>Down panel</p></Tabs.Content>
	</Tabs.Root>
</div>
