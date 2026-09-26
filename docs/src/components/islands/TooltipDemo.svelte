<script lang="ts">
	import { Tooltip } from 'svbase';

	import { tooltipContent, card, hint, btn, row } from '../demo.js';
</script>

<div class={card}>
	<div class={row}>
		<Tooltip.Root>
			<Tooltip.Trigger class={btn}>Hover or focus me</Tooltip.Trigger>
			<Tooltip.Content class={tooltipContent}
				>Helpful hint with a 600ms hover delay.</Tooltip.Content
			>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger delay={0} class={btn}>Instant tooltip</Tooltip.Trigger>
			<Tooltip.Content class={tooltipContent}>No delay on this one.</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<p class={hint}>After closing one tooltip, the next opens instantly (400ms skip window).</p>
</div>
