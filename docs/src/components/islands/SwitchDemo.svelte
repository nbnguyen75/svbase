<script lang="ts">
	import { Switch } from 'svbase';

	let switchChecked = $state(false);
	let switchChanges = $state<string[]>([]);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<div class="flex flex-wrap items-center gap-3">
		<Switch.Root
			bind:checked={switchChecked}
			onCheckedChange={(checked) => {
				switchChanges = [...switchChanges, checked ? 'on' : 'off'];
			}}
		>
			<Switch.Thumb />
			Airplane mode ({switchChecked ? 'on' : 'off'})
		</Switch.Root>
		<Switch.Root disabled>
			<Switch.Thumb />
			Disabled
		</Switch.Root>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">
		Changes: {switchChanges.length ? switchChanges.join(', ') : '—'}
	</p>
</div>
