<script lang="ts">
	import { Tooltip } from '$lib/index.js';
</script>

<h1>Tooltip</h1>
<p>Hover/focus hint with delay and skip-delay across items.</p>

<section>
	<Tooltip.Root>
		<Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
		<Tooltip.Content>Helpful hint with a 600ms hover delay.</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger delay={0}>Instant tooltip</Tooltip.Trigger>
		<Tooltip.Content>No delay on this one.</Tooltip.Content>
	</Tooltip.Root>
	<p>After closing one tooltip, the next opens instantly (400ms skip window).</p>
</section>
