<script lang="ts">
	import { Toggle } from 'svbase';

	let toggleChanges = $state<string[]>([]);
	let controlledPressed = $state(false);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<div class="flex flex-wrap items-center gap-3">
		<Toggle
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			onPressedChange={(pressed) => {
				toggleChanges = [...toggleChanges, pressed ? 'on' : 'off'];
			}}
		>
			Uncontrolled toggle
		</Toggle>
		<Toggle
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			bind:pressed={controlledPressed}
		>
			Controlled: {controlledPressed ? 'on' : 'off'}
		</Toggle>
		<Toggle
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			disabled
		>
			Disabled toggle
		</Toggle>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">
		Changes: {toggleChanges.length ? toggleChanges.join(', ') : '—'}
	</p>
	<p class="mt-3 text-sm text-muted-foreground">
		State surfaces as <code>aria-pressed</code> plus <code>data-pressed</code> for styling.
	</p>
</div>
