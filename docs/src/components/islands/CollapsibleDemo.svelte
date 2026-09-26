<script lang="ts">
	import { Collapsible } from 'svbase';

	import {
		disclosurePanelInner,
		disclosureTrigger,
		disclosurePanel,
		chevron,
		card,
		row
	} from '../demo.js';

	let controlledOpen = $state(false);
</script>

<div class={card}>
	<div class={row}>
		<Collapsible.Root>
			<Collapsible.Trigger class={disclosureTrigger}>
				Show more
				<span aria-hidden="true" class={chevron}>▾</span>
			</Collapsible.Trigger>
			<Collapsible.Panel class={disclosurePanel}>
				<p class={disclosurePanelInner}>Hidden details live here.</p>
			</Collapsible.Panel>
		</Collapsible.Root>
		<Collapsible.Root bind:open={controlledOpen}>
			<Collapsible.Trigger class={disclosureTrigger}>
				Controlled ({controlledOpen ? 'open' : 'closed'})
				<span aria-hidden="true" class={chevron}>▾</span>
			</Collapsible.Trigger>
			<Collapsible.Panel class={disclosurePanel}>
				<p class={disclosurePanelInner}>Controlled panel content.</p>
			</Collapsible.Panel>
		</Collapsible.Root>
		<Collapsible.Root disabled>
			<Collapsible.Trigger class={disclosureTrigger}>
				Disabled
				<span aria-hidden="true" class={chevron}>▾</span>
			</Collapsible.Trigger>
			<Collapsible.Panel class={disclosurePanel}>
				<p class={disclosurePanelInner}>Never shown.</p>
			</Collapsible.Panel>
		</Collapsible.Root>
	</div>
</div>
