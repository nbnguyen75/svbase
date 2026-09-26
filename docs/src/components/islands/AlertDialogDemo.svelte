<script lang="ts">
	import { AlertDialog } from 'svbase';
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<AlertDialog.Root>
		<AlertDialog.Trigger
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
		>
			Delete item
		</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay class="fixed inset-0 bg-black/50" />
			<AlertDialog.Content
				class="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-lg"
			>
				<AlertDialog.Title class="text-lg font-semibold">Delete item?</AlertDialog.Title>
				<AlertDialog.Description class="text-sm text-muted-foreground">
					This action cannot be undone.
				</AlertDialog.Description>
				<AlertDialog.Close
					class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
				>
					Cancel
				</AlertDialog.Close>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
</div>
