<script lang="ts">
	import { Switch } from '$lib/index.js';

	let switchChecked = $state(false);
	let switchChanges = $state<string[]>([]);
</script>

<h1>Switch</h1>
<p>Toggle switch with <code>aria-checked</code> and thumb.</p>

<section>
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
	<p>Changes: {switchChanges.length ? switchChanges.join(', ') : '—'}</p>
</section>
