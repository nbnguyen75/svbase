<script lang="ts">
	import { Progress } from '../../index.js';
</script>

<Progress.Root value={30} ariaLabel="Upload progress">
	<Progress.Indicator />
</Progress.Root>
<Progress.Root ariaLabel="Loading">
	<Progress.Indicator />
</Progress.Root>
<Progress.Root value={100} ariaLabel="Complete">
	<Progress.Indicator />
</Progress.Root>
