<script lang="ts">
	import { Collapsible } from '../../index.js';
</script>

<Collapsible.Root>
	<Collapsible.Trigger>Details</Collapsible.Trigger>
	<Collapsible.Panel>
		<p>Hidden content</p>
	</Collapsible.Panel>
</Collapsible.Root>
<Collapsible.Root defaultOpen>
	<Collapsible.Trigger>Open by default</Collapsible.Trigger>
	<Collapsible.Panel>
		<p>Visible content</p>
	</Collapsible.Panel>
</Collapsible.Root>
