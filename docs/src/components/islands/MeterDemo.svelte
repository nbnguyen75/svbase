<script lang="ts">
	import { Meter } from 'svbase';

	let storage = $state(72);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Meter.Root bind:value={storage} min={0} max={100} low={20} high={80} optimum={50} ariaLabel="Storage used">
		<Meter.Label>Storage</Meter.Label>
		<Meter.Track class="h-2 overflow-hidden rounded-full bg-muted">
			<Meter.Indicator class="h-full rounded-full bg-primary" />
		</Meter.Track>
		<Meter.Value />
	</Meter.Root>
	<div class="mt-3 flex flex-wrap items-center gap-2">
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (storage = 10)}
		>
			Low
		</button>
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (storage = 72)}
		>
			Normal
		</button>
		<button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (storage = 95)}
		>
			High
		</button>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">
		Style the <code>data-state="low|normal|high"</code> bands with CSS.
	</p>
</div>
