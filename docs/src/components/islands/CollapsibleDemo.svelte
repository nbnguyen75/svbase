<script lang="ts">
	import { Collapsible } from 'svbase';

	let controlledOpen = $state(false);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<div class="flex flex-wrap items-center gap-3">
		<Collapsible.Root>
			<Collapsible.Trigger>Show more</Collapsible.Trigger>
			<Collapsible.Panel>
				<p>Hidden details live here.</p>
			</Collapsible.Panel>
		</Collapsible.Root>
		<Collapsible.Root bind:open={controlledOpen}>
			<Collapsible.Trigger>Controlled ({controlledOpen ? 'open' : 'closed'})</Collapsible.Trigger>
			<Collapsible.Panel>
				<p>Controlled panel content.</p>
			</Collapsible.Panel>
		</Collapsible.Root>
		<Collapsible.Root disabled>
			<Collapsible.Trigger>Disabled</Collapsible.Trigger>
			<Collapsible.Panel>
				<p>Never shown.</p>
			</Collapsible.Panel>
		</Collapsible.Root>
	</div>
</div>
