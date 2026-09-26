<script lang="ts">
	import { NumberField } from 'svbase';

	let volume = $state(30);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<NumberField.Root bind:value={volume} name="volume" min={0} max={100}>
		<NumberField.Group class="flex items-center gap-2">
			<NumberField.Decrement
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-transparent text-sm font-medium transition-colors hover:bg-accent"
			>
				-
			</NumberField.Decrement>
			<NumberField.Input
				aria-label="Volume"
				class="h-9 w-24 rounded-md border bg-transparent px-3 text-sm"
			/>
			<NumberField.Increment
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-transparent text-sm font-medium transition-colors hover:bg-accent"
			>
				+
			</NumberField.Increment>
		</NumberField.Group>
	</NumberField.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Volume: {volume ?? '—'} (type, use arrows, or step; commits clamp to 0–100)
	</p>
</div>
