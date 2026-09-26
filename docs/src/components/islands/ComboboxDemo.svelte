<script lang="ts">
	import { Combobox } from 'svbase';

	let fruit: string | null = $state(null);
	let city: string | null = $state(null);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Combobox.Root bind:value={fruit} name="fruit">
		<Combobox.Input aria-label="Fruit" placeholder="Pick a fruit" />
		<Combobox.Portal>
			<Combobox.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
				<Combobox.Item value="apple" class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
					Apple
				</Combobox.Item>
				<Combobox.Item
					value="banana"
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
				>
					Banana
				</Combobox.Item>
				<Combobox.Item
					value="cherry"
					disabled
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
				>
					Cherry
				</Combobox.Item>
				<Combobox.Group>
					<Combobox.GroupLabel class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
						Citrus
					</Combobox.GroupLabel>
					<Combobox.Item
						value="orange"
						class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					>
						Orange
					</Combobox.Item>
				</Combobox.Group>
				<Combobox.Empty class="px-2 py-1.5 text-sm text-muted-foreground">No matches</Combobox.Empty
				>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Selected: {fruit ?? '—'} (type to filter, Enter to commit)
	</p>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>Autocomplete with free input</h3>
	<Combobox.Root bind:value={city} freeInput>
		<Combobox.Input aria-label="City" placeholder="Type any city" />
		<Combobox.Portal>
			<Combobox.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
				<Combobox.Item value="paris" class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
					Paris
				</Combobox.Item>
				<Combobox.Item value="porto" class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
					Porto
				</Combobox.Item>
				<Combobox.Empty class="px-2 py-1.5 text-sm text-muted-foreground">
					Press Enter to use your text
				</Combobox.Empty>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
	<p class="mt-3 text-sm text-muted-foreground">Value: {city ?? '—'}</p>
</div>
