<script lang="ts">
	import { ToggleGroup } from 'svbase';

	let align: string | null = $state(null);
	let styles: Array<string> = $state([]);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<ToggleGroup.Root bind:value={align} name="align">
		<div class="flex flex-wrap items-center gap-2">
			<ToggleGroup.Item
				value="left"
				class="rounded-md border px-3 py-1.5 text-sm data-pressed:bg-accent"
			>
				Left
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="center"
				class="rounded-md border px-3 py-1.5 text-sm data-pressed:bg-accent"
			>
				Center
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="right"
				disabled
				class="rounded-md border px-3 py-1.5 text-sm data-pressed:bg-accent"
			>
				Right
			</ToggleGroup.Item>
		</div>
	</ToggleGroup.Root>
	<p class="mt-3 text-sm text-muted-foreground">Aligned: {align ?? '—'} (click again to clear)</p>
</div>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<h3>Multiple</h3>
	<ToggleGroup.Root bind:value={styles} multiple>
		<div class="flex flex-wrap items-center gap-2">
			<ToggleGroup.Item
				value="bold"
				class="rounded-md border px-3 py-1.5 text-sm data-pressed:bg-accent"
			>
				Bold
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="italic"
				class="rounded-md border px-3 py-1.5 text-sm data-pressed:bg-accent"
			>
				Italic
			</ToggleGroup.Item>
		</div>
	</ToggleGroup.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Styles: {styles.length ? styles.join(', ') : '—'}
	</p>
</div>
