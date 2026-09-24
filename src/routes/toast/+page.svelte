<script lang="ts">
	import { Toast } from '$lib/index.js';

	let count = $state(0);
</script>

<h1>Toast</h1>
<p>Auto-dismissing notifications with swipe, pause-on-hover, and live regions.</p>

<section>
	<button
		onclick={() => {
			count += 1;
		}}
	>
		Show toast ({count} shown)
	</button>
	<Toast.Provider>
		<Toast.Viewport>
			{#each Array(count) as _, index (index)}
				<Toast.Root>
					<Toast.Title>Saved ({index + 1})</Toast.Title>
					<Toast.Description>All changes saved.</Toast.Description>
					<Toast.Action>Undo</Toast.Action>
					<Toast.Close>Dismiss</Toast.Close>
				</Toast.Root>
			{/each}
		</Toast.Viewport>
	</Toast.Provider>
	<p>Hover a toast to pause its timer; swipe it sideways past 40px to dismiss.</p>
</section>
