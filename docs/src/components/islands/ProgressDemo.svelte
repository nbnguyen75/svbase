<script lang="ts">
	import { Progress, Button } from 'svbase';

	let value = $state(30);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Progress.Root {value} ariaLabel="Upload progress">
		<Progress.Indicator class="h-2 rounded-full bg-primary" />
	</Progress.Root>
	<p class="mt-3 text-sm text-muted-foreground">{value}%</p>
	<div class="flex flex-wrap items-center gap-3">
		<Button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (value = Math.min(100, value + 10))}
		>
			+10
		</Button>
		<Button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onclick={() => (value = 0)}
		>
			Reset
		</Button>
	</div>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>Indeterminate</h3>
	<Progress.Root ariaLabel="Loading">
		<Progress.Indicator class="h-2 rounded-full bg-primary" />
	</Progress.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		No value — animate <code>[data-state='indeterminate']</code> with CSS.
	</p>
</div>
