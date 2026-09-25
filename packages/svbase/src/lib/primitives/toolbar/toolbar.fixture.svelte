<script lang="ts">
	import { Toolbar } from '../../index.js';

	let saved = $state(0);
</script>

<Toolbar.Root>
	<Toolbar.Button onclick={() => (saved += 1)}>Save</Toolbar.Button>
	<Toolbar.Button disabled>Cut</Toolbar.Button>
	<Toolbar.Separator />
	<Toolbar.Link href="https://example.com">Help</Toolbar.Link>
	<Toolbar.Input aria-label="Search" placeholder="Search" />
</Toolbar.Root>
<p>Saved: {saved}</p>
