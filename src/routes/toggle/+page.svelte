<script lang="ts">
	import { Toggle } from '$lib/index.js';

	let toggleChanges = $state<string[]>([]);
	let controlledPressed = $state(false);
</script>

<h1>Toggle</h1>
<p>Two-state button with <code>aria-pressed</code>.</p>

<section>
	<Toggle
		onPressedChange={(pressed) => {
			toggleChanges = [...toggleChanges, pressed ? 'on' : 'off'];
		}}
	>
		Uncontrolled toggle
	</Toggle>
	<Toggle bind:pressed={controlledPressed}>Controlled: {controlledPressed ? 'on' : 'off'}</Toggle>
	<Toggle disabled>Disabled toggle</Toggle>
	<p>Changes: {toggleChanges.length ? toggleChanges.join(', ') : '—'}</p>
</section>
