<script lang="ts">
	import { Accordion } from 'svbase';

	import {
		disclosurePanelInner,
		disclosureTrigger,
		disclosurePanel,
		accordionItem,
		chevron,
		card,
		hint
	} from '../demo.js';

	let value = $state<Array<string>>(['a']);
</script>

<div class={card}>
	<Accordion.Root bind:value>
		<Accordion.Item value="a" class={accordionItem}>
			<Accordion.Header>
				<Accordion.Trigger class={disclosureTrigger}>
					First
					<span aria-hidden="true" class={chevron}>▾</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel class={disclosurePanel}>
				<p class={disclosurePanelInner}>First panel content.</p>
			</Accordion.Panel>
		</Accordion.Item>
		<Accordion.Item value="b" class={accordionItem}>
			<Accordion.Header>
				<Accordion.Trigger class={disclosureTrigger}>
					Second
					<span aria-hidden="true" class={chevron}>▾</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel class={disclosurePanel}>
				<p class={disclosurePanelInner}>Second panel content.</p>
			</Accordion.Panel>
		</Accordion.Item>
		<Accordion.Item value="c" disabled class={accordionItem}>
			<Accordion.Header>
				<Accordion.Trigger class={disclosureTrigger}>
					Third (disabled)
					<span aria-hidden="true" class={chevron}>▾</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel class={disclosurePanel}>
				<p class={disclosurePanelInner}>Never shown.</p>
			</Accordion.Panel>
		</Accordion.Item>
	</Accordion.Root>
	<p class={hint}>
		Open: {value.length ? value.join(', ') : '—'} (Tab in, arrows move focus, Enter/Space toggles)
	</p>
</div>

<div class={card}>
	<h3>Multiple</h3>
	<Accordion.Root multiple defaultValue={['x']}>
		<Accordion.Item value="x" class={accordionItem}>
			<Accordion.Header>
				<Accordion.Trigger class={disclosureTrigger}>
					Ex one
					<span aria-hidden="true" class={chevron}>▾</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel class={disclosurePanel}>
				<p class={disclosurePanelInner}>Ex one panel.</p>
			</Accordion.Panel>
		</Accordion.Item>
		<Accordion.Item value="y" class={accordionItem}>
			<Accordion.Header>
				<Accordion.Trigger class={disclosureTrigger}>
					Ex two
					<span aria-hidden="true" class={chevron}>▾</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel class={disclosurePanel}>
				<p class={disclosurePanelInner}>Ex two panel.</p>
			</Accordion.Panel>
		</Accordion.Item>
	</Accordion.Root>
</div>
