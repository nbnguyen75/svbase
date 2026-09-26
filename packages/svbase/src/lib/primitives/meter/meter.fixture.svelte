<script lang="ts">
	import { Meter } from '../../index.js';
</script>

<Meter.Root value={30} ariaLabel="Upload progress">
	<Meter.Label>Upload</Meter.Label>
	<Meter.Track>
		<Meter.Indicator />
	</Meter.Track>
	<Meter.Value />
</Meter.Root>

<Meter.Root value={150} max={100} low={20} high={80} ariaLabel="Overflowing gauge">
	<Meter.Track>
		<Meter.Indicator />
	</Meter.Track>
</Meter.Root>

<Meter.Root value={10} low={20} high={80} optimum={50} ariaLabel="Low gauge">
	<Meter.Track>
		<Meter.Indicator />
	</Meter.Track>
</Meter.Root>
