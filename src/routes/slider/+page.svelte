<script lang="ts">
	import { Slider } from '$lib/index.js';

	let volume = $state(30);
	let range = $state([20, 80]);
</script>

<h1>Slider</h1>
<p>Single and range sliders with keyboard stepping and pointer drag.</p>

<section>
	<Slider.Root bind:value={volume}>
		<Slider.Track style="width: 240px; height: 24px; position: relative;">
			<Slider.Thumb ariaLabel="Volume" />
		</Slider.Track>
	</Slider.Root>
	<p>Volume: {volume} (arrows ±1, PageUp/Down ±10, Home/End, or drag)</p>
</section>

<section>
	<h2>Range</h2>
	<Slider.Root bind:value={range} minStepsBetweenValues={5}>
		<Slider.Track style="width: 240px; height: 24px; position: relative;">
			<Slider.Thumb index={0} ariaLabel="Min price" />
			<Slider.Thumb index={1} ariaLabel="Max price" />
		</Slider.Track>
	</Slider.Root>
	<p>Range: {range.join(' – ')} (thumbs push with 5 minimum distance)</p>
</section>

<section>
	<h2>Vertical</h2>
	<Slider.Root orientation="vertical" defaultValue={40}>
		<Slider.Track style="width: 24px; height: 160px; position: relative;">
			<Slider.Thumb ariaLabel="Level" />
		</Slider.Track>
	</Slider.Root>
</section>
