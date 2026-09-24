<script lang="ts">
	import { Tooltip } from '../../index.js';
</script>

<Tooltip.Root>
	<Tooltip.Trigger delay={50} closeDelay={50}>Hover me</Tooltip.Trigger>
	<Tooltip.Content>Helpful hint</Tooltip.Content>
</Tooltip.Root>
<Tooltip.Root>
	<Tooltip.Trigger delay={2000} closeDelay={50}>Second</Tooltip.Trigger>
	<Tooltip.Content>Second hint</Tooltip.Content>
</Tooltip.Root>
