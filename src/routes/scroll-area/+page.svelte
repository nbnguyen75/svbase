<script lang="ts">
	import { ScrollArea } from '$lib/index.js';

	const lines = Array.from({ length: 30 }, (_, index) => `Line ${index + 1}`);
</script>

<h1>Scroll Area</h1>
<p>Native scrolling with a custom thumb and track. Style the parts with CSS.</p>

<section>
	<ScrollArea.Root>
		<ScrollArea.Viewport style="height: 200px; border: 1px solid;">
			{#each lines as line (line)}
				<p style="margin: 0;">{line}</p>
			{/each}
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar style="width: 12px;">
			<ScrollArea.Thumb style="background: gray;" />
		</ScrollArea.Scrollbar>
	</ScrollArea.Root>
	<p>Drag the thumb, click the track, or Tab in and scroll with keys.</p>
</section>
