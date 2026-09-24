<script lang="ts">
	import { Slider } from '$lib/index.js';

	let committed: number | Array<number> | undefined = $state(undefined);
</script>

<Slider.Root onValueCommitted={(value) => (committed = value)}>
	<Slider.Track data-testid="track-single" style="width: 200px; height: 20px;">
		<Slider.Thumb ariaLabel="Volume" />
	</Slider.Track>
</Slider.Root>
<Slider.Root defaultValue={[20, 80]}>
	<Slider.Track data-testid="track-range" style="width: 200px; height: 20px;">
		<Slider.Thumb index={0} ariaLabel="Min price" />
		<Slider.Thumb index={1} ariaLabel="Max price" />
	</Slider.Track>
</Slider.Root>
<Slider.Root disabled defaultValue={30}>
	<Slider.Track>
		<Slider.Thumb ariaLabel="Disabled" />
	</Slider.Track>
</Slider.Root>
<p>Committed: {committed === undefined ? '—' : JSON.stringify(committed)}</p>
