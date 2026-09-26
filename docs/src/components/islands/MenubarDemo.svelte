<script lang="ts">
	import { Menubar } from 'svbase';

	let picked: string | null = $state(null);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Menubar.Root>
		<Menubar.Menu value="file">
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
				<Menubar.Item
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					onSelect={() => (picked = 'new')}
				>
					New
				</Menubar.Item>
				<Menubar.Item
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					onSelect={() => (picked = 'open')}
				>
					Open
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu value="edit">
			<Menubar.Trigger>Edit</Menubar.Trigger>
			<Menubar.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
				<Menubar.Item
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					onSelect={() => (picked = 'undo')}
				>
					Undo
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
	<p class="mt-3 text-sm text-muted-foreground">Picked: {picked ?? '—'} (Tab in, arrows travel, Enter opens)</p>
</div>
