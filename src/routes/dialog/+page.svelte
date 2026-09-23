<script lang="ts">
	import { Dialog } from '$lib/index.js';

	let open = $state(false);
</script>

<h1>Dialog</h1>
<p>Modal dialog with focus trap, scroll lock, and Escape dismissal.</p>

<section>
	<Dialog.Root bind:open>
		<Dialog.Trigger>Open dialog (currently {open ? 'open' : 'closed'})</Dialog.Trigger>
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
	<p>Tab cycles inside while open; Escape closes and returns focus here.</p>
</section>
