<script lang="ts">
	import { Button } from '../../index.js';

	let clicks = $state(0);

	function count(): void {
		clicks += 1;
	}
</script>

<Button onclick={count}>Press me</Button>
<Button disabled>Cannot press</Button>
<Button element="div" onclick={count}>Div button</Button>
<p>Clicks: {clicks}</p>
