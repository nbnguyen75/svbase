<script lang="ts">
	import { ContextMenu } from 'svbase';

	let picked: string | null = $state(null);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			<div class="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
				Right-click here (or long-press on touch)
			</div>
			<ContextMenu.Portal>
				<ContextMenu.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
					<ContextMenu.Item
						class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
						onSelect={() => (picked = 'cut')}
					>
						Cut
					</ContextMenu.Item>
					<ContextMenu.Item
						class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
						onSelect={() => (picked = 'copy')}
					>
						Copy
					</ContextMenu.Item>
					<ContextMenu.Separator class="my-1 border-t" />
					<ContextMenu.SubRoot>
						<ContextMenu.SubTrigger class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
							Share
						</ContextMenu.SubTrigger>
						<ContextMenu.Portal>
							<ContextMenu.Content class="min-w-40 rounded-lg border bg-popover p-1 shadow-md">
								<ContextMenu.Item
									class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
									onSelect={() => (picked = 'email')}
								>
									Email
								</ContextMenu.Item>
							</ContextMenu.Content>
						</ContextMenu.Portal>
					</ContextMenu.SubRoot>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Trigger>
	</ContextMenu.Root>
	<p class="mt-3 text-sm text-muted-foreground">Picked: {picked ?? '—'}</p>
</div>
