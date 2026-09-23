<script lang="ts">
	import { Collapsible } from '$lib/index.js';

	let controlledOpen = $state(false);
</script>

<h1>Collapsible</h1>
<p>Expandable region with trigger, panel, and generated id linkage.</p>

<section>
	<Collapsible.Root>
		<Collapsible.Trigger>Show more</Collapsible.Trigger>
		<Collapsible.Panel>
			<p>Hidden details live here. Inspect <code>aria-controls</code> linkage.</p>
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
</section>
