<script lang="ts">
	import { Drawer } from 'svbase';
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Drawer.Root side="right">
		<Drawer.Trigger
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
		>
			Open right drawer
		</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/50" />
			<Drawer.Content class="w-full max-w-md border bg-card p-6 shadow-lg">
				<Drawer.Title class="text-lg font-semibold">Notifications</Drawer.Title>
				<Drawer.Description class="text-sm text-muted-foreground">
					Edge-anchored, focus-trapped, Escape-dismissed.
				</Drawer.Description>
				<Drawer.Close
					class="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
				>
					Close
				</Drawer.Close>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
</div>
