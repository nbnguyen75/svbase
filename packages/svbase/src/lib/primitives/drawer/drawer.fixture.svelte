<script lang="ts">
	import { Drawer } from '../../index.js';

	let leftOpen = $state(false);
</script>

<Drawer.Root side="right">
	<Drawer.Trigger>Open right drawer</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay />
		<Drawer.Content aria-label="Right drawer">
			<Drawer.Title>Right drawer</Drawer.Title>
			<Drawer.Description>Anchored to the right edge.</Drawer.Description>
			<Drawer.Close>Close</Drawer.Close>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

<Drawer.Root side="left" open={leftOpen} onOpenChange={(next) => (leftOpen = next)}>
	<Drawer.Trigger>Open left drawer</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay />
		<Drawer.Content aria-label="Left drawer">
			<Drawer.Title>Left drawer</Drawer.Title>
			<Drawer.Close>Close</Drawer.Close>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
<p>Left open: {leftOpen ? 'yes' : 'no'}</p>
