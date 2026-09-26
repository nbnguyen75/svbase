<script lang="ts">
	import { Popover, Button } from 'svbase';
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<div class="flex flex-wrap items-center gap-3">
		<Popover.Root>
			<Popover.Trigger
				class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			>
				Options
			</Popover.Trigger>
			<Popover.Content class="rounded-lg border bg-popover p-4 text-popover-foreground shadow-md">
				<p>Popover body. Click outside or press Escape to dismiss.</p>
				<Button
					class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
				>
					Inner action
				</Button>
			</Popover.Content>
		</Popover.Root>
	</div>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>With arrow and offset</h3>
	<Popover.Root sideOffset={8}>
		<Popover.Trigger
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
		>
			With arrow
		</Popover.Trigger>
		<Popover.Content class="rounded-lg border bg-popover p-4 text-popover-foreground shadow-md">
			<Popover.Arrow>◆</Popover.Arrow>
			<p>Arrow centers on the trigger edge.</p>
		</Popover.Content>
	</Popover.Root>
</div>
