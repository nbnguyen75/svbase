<script lang="ts">
	import { Menubar } from '../../index.js';

	let picked: string | null = $state(null);
</script>

<Menubar.Root>
	<Menubar.Menu value="file">
		<Menubar.Trigger>File</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item onSelect={() => (picked = 'new')}>New</Menubar.Item>
			<Menubar.Item onSelect={() => (picked = 'open')}>Open</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu value="edit">
		<Menubar.Trigger>Edit</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item onSelect={() => (picked = 'undo')}>Undo</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
<p>Picked: {picked ?? '—'}</p>
