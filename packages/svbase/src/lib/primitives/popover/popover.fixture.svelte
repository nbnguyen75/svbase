<script lang="ts">
	import { Popover } from '../../index.js';
</script>

<Popover.Root>
	<Popover.Trigger>Options</Popover.Trigger>
	<Popover.Content>
		<p>Popover body</p>
		<button>Inner action</button>
	</Popover.Content>
</Popover.Root>
<div style="position: fixed; bottom: 0; left: 40%;">
	<Popover.Root>
		<Popover.Trigger>Pinned bottom</Popover.Trigger>
		<Popover.Content>
			<p>Flipped content</p>
		</Popover.Content>
	</Popover.Root>
</div>
