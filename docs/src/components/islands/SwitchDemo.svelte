<script lang="ts">
	import { Switch } from 'svbase';

	import { switchThumb, switchTrack, label, card, hint, row } from '../demo.js';

	let switchChecked = $state(false);
	let switchChanges = $state<string[]>([]);
</script>

<div class={card}>
	<div class={row}>
		<label class={label}>
			<Switch.Root
				class={switchTrack}
				bind:checked={switchChecked}
				onCheckedChange={(checked) => {
					switchChanges = [...switchChanges, checked ? 'on' : 'off'];
				}}
			>
				<Switch.Thumb class={switchThumb} />
			</Switch.Root>
			Airplane mode ({switchChecked ? 'on' : 'off'})
		</label>
		<label class="{label} opacity-60">
			<Switch.Root disabled class={switchTrack}>
				<Switch.Thumb class={switchThumb} />
			</Switch.Root>
			Disabled
		</label>
	</div>
	<p class={hint}>Changes: {switchChanges.length ? switchChanges.join(', ') : '—'}</p>
</div>
