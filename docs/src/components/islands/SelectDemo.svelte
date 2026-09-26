<script lang="ts">
	import { Select } from 'svbase';

	let fruit: string | null = $state(null);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Select.Root name="fruit" bind:value={fruit}>
		<Select.Trigger aria-label="Fruit">
			<Select.Value placeholder="Pick a fruit" />
		</Select.Trigger>
		<Select.Portal>
			<Select.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
				<Select.Viewport>
					<Select.Item value="apple" class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
						Apple
					</Select.Item>
					<Select.Item value="banana" class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
						Banana
					</Select.Item>
					<Select.Item
						value="cherry"
						disabled
						class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					>
						Cherry
					</Select.Item>
					<Select.Group>
						<Select.Label class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
							Citrus
						</Select.Label>
						<Select.Item value="orange" class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
							Orange
						</Select.Item>
						<Select.Item value="lemon" class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
							Lemon
						</Select.Item>
					</Select.Group>
				</Select.Viewport>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Selected: {fruit ?? '—'} (Tab in, arrows select directly; Enter opens; type a letter to jump)
	</p>
</div>
