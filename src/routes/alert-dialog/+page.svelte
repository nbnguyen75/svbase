<script lang="ts">
	import { AlertDialog } from '$lib/index.js';
</script>

<h1>Alert Dialog</h1>
<p>Modal confirmation that ignores overlay clicks (Escape still closes).</p>

<section>
	<AlertDialog.Root>
		<AlertDialog.Trigger>Delete item</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay />
			<AlertDialog.Content>
				<AlertDialog.Title>Delete item?</AlertDialog.Title>
				<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
				<AlertDialog.Close>Cancel</AlertDialog.Close>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
</section>
