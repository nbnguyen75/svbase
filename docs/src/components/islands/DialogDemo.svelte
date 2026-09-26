<script lang="ts">
	import { Button, Dialog } from 'svbase';

	let open = $state(false);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Dialog.Root bind:open>
		<Dialog.Trigger
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
		>
			Open dialog (currently {open ? 'open' : 'closed'})
		</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay class="fixed inset-0 bg-black/50" />
			<Dialog.Content
				class="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-lg"
			>
				<Dialog.Title class="text-lg font-semibold">Confirm action</Dialog.Title>
				<Dialog.Description class="text-sm text-muted-foreground">
					This cannot be undone.
				</Dialog.Description>
				<div class="flex flex-wrap items-center gap-3">
					<Button
						class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
					>
						Extra action
					</Button>
					<Dialog.Close
						class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
					>
						Close
					</Dialog.Close>
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Tab cycles inside while open; Escape closes and returns focus here.
	</p>
</div>
