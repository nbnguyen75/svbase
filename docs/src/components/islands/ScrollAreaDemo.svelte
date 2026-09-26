<script lang="ts">
	import { ScrollArea } from 'svbase';

	const lines = Array.from({ length: 30 }, (_, index) => `Line ${index + 1}`);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
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
	<p class="mt-3 text-sm text-muted-foreground">
		Drag the thumb, click the track, or Tab in and scroll with keys.
	</p>
</div>
