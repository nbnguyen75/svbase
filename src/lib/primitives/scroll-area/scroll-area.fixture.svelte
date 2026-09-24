<script lang="ts">
	import { ScrollArea } from '$lib/index.js';
</script>

<ScrollArea.Root>
	<ScrollArea.Viewport data-testid="viewport" style="height: 200px;">
		<div style="height: 600px; overflow: hidden;">
			<p>Line one</p>
			<p>Line two</p>
			<p>Line three</p>
		</div>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar data-testid="scrollbar" style="height: 200px; position: relative;">
		<ScrollArea.Thumb data-testid="thumb" />
	</ScrollArea.Scrollbar>
</ScrollArea.Root>
