<script lang="ts">
	import { Dialog } from '$lib/index.js';
</script>

<Dialog.Root>
	<Dialog.Trigger>Open dialog</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Confirm action</Dialog.Title>
			<Dialog.Description>This cannot be undone.</Dialog.Description>
			<button>Extra action</button>
			<Dialog.Close>Close</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
