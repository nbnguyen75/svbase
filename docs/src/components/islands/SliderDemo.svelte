<script lang="ts">
	import { Slider } from 'svbase';

	import { sliderThumb, card, hint } from '../demo.js';

	let volume = $state(30);
	let range = $state([20, 80]);
</script>

<div class={card}>
	<Slider.Root bind:value={volume}>
		<Slider.Track style="width: 240px; height: 24px; position: relative;">
			<Slider.Thumb
				ariaLabel="Volume"
				class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background shadow"
			/>
		</Slider.Track>
	</Slider.Root>
	<p class={hint}>
		Volume: {volume} (arrows ±1, PageUp/Down ±10, Home/End, or drag)
	</p>
</div>

<div class={card}>
	<h3>Range</h3>
	<Slider.Root bind:value={range} minStepsBetweenValues={5}>
		<Slider.Track style="width: 240px; height: 24px; position: relative;">
			<Slider.Thumb index={0} ariaLabel="Min price" class={sliderThumb} />
			<Slider.Thumb index={1} ariaLabel="Max price" class={sliderThumb} />
		</Slider.Track>
	</Slider.Root>
	<p class={hint}>
		Range: {range.join(' – ')} (thumbs push with 5 minimum distance)
	</p>
</div>

<div class={card}>
	<h3>Vertical</h3>
	<Slider.Root orientation="vertical" defaultValue={40}>
		<Slider.Track style="width: 24px; height: 160px; position: relative;">
			<Slider.Thumb ariaLabel="Level" class={sliderThumb} />
		</Slider.Track>
	</Slider.Root>
</div>
