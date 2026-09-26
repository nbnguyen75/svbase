<script lang="ts">
	import { Tooltip } from 'svbase';
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Tooltip.Root>
		<Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
		<Tooltip.Content>Helpful hint with a 600ms hover delay.</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger delay={0}>Instant tooltip</Tooltip.Trigger>
		<Tooltip.Content>No delay on this one.</Tooltip.Content>
	</Tooltip.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		After closing one tooltip, the next opens instantly (400ms skip window).
	</p>
</div>
