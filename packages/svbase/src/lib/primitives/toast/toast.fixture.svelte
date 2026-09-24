<script lang="ts">
	import { Toast } from '../../index.js';
</script>

<Toast.Provider timeout={800}>
	<Toast.Viewport>
		<Toast.Root data-testid="basic">
			<Toast.Title>Saved</Toast.Title>
			<Toast.Description>All changes saved.</Toast.Description>
			<Toast.Close>Dismiss</Toast.Close>
		</Toast.Root>
		<Toast.Root duration={200} data-testid="fast">
			<Toast.Title>Quick note</Toast.Title>
		</Toast.Root>
		<Toast.Root duration={Infinity} data-testid="sticky">
			<Toast.Title>Sticky</Toast.Title>
			<Toast.Action>Undo</Toast.Action>
		</Toast.Root>
	</Toast.Viewport>
</Toast.Provider>
