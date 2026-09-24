<script lang="ts">
	import { Progress } from '$lib/index.js';

	let value = $state(30);
</script>

<h1>Progress</h1>
<p>Determinate and indeterminate progress bars.</p>

<section>
	<Progress.Root {value} ariaLabel="Upload progress">
		<Progress.Indicator />
	</Progress.Root>
	<p>{value}%</p>
	<button onclick={() => (value = Math.min(100, value + 10))}>+10</button>
	<button onclick={() => (value = 0)}>Reset</button>
</section>

<section>
	<h2>Indeterminate</h2>
	<Progress.Root ariaLabel="Loading">
		<Progress.Indicator />
	</Progress.Root>
	<p>No value — animate <code>[data-state='indeterminate']</code> with CSS.</p>
</section>
