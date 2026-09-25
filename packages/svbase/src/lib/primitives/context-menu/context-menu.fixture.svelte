<script lang="ts">
	import { ContextMenu } from '../../index.js';

	let picked: string | null = $state(null);
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<p>Right-click here</p>
		<ContextMenu.Portal>
			<ContextMenu.Content>
				<ContextMenu.Item onSelect={() => (picked = 'cut')}>Cut</ContextMenu.Item>
				<ContextMenu.Item onSelect={() => (picked = 'copy')}>Copy</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.SubRoot>
					<ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
					<ContextMenu.Portal>
						<ContextMenu.Content>
							<ContextMenu.Item onSelect={() => (picked = 'email')}>Email</ContextMenu.Item>
						</ContextMenu.Content>
					</ContextMenu.Portal>
				</ContextMenu.SubRoot>
			</ContextMenu.Content>
		</ContextMenu.Portal>
	</ContextMenu.Trigger>
</ContextMenu.Root>
<p>Picked: {picked ?? '—'}</p>

<ContextMenu.Root>
	<ContextMenu.Trigger disabled>
		<p>Disabled area</p>
		<ContextMenu.Portal>
			<ContextMenu.Content>
				<ContextMenu.Item>Never shown</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Portal>
	</ContextMenu.Trigger>
</ContextMenu.Root>
