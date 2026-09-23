<script lang="ts">
	import { Popover } from '$lib/index.js';
</script>

<h1>Popover</h1>
<p>Anchored floating panel with flip-on-collision positioning.</p>

<section>
	<Popover.Root>
		<Popover.Trigger>Options</Popover.Trigger>
		<Popover.Content>
			<p>Popover body. Click outside or press Escape to dismiss.</p>
			<button>Inner action</button>
		</Popover.Content>
	</Popover.Root>
</section>

<section>
	<h2>With arrow and offset</h2>
	<Popover.Root sideOffset={8}>
		<Popover.Trigger>With arrow</Popover.Trigger>
		<Popover.Content>
			<Popover.Arrow>◆</Popover.Arrow>
			<p>Arrow centers on the trigger edge.</p>
		</Popover.Content>
	</Popover.Root>
</section>
