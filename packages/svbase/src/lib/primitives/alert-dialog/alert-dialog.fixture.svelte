<script lang="ts">
	import { AlertDialog } from '../../index.js';
</script>

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
