<script lang="ts">
	import { Separator } from 'svbase';
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<p>Above</p>
	<Separator.Separator class="my-4 border-t" />
	<p>Below</p>
	<div class="flex items-center gap-3">
		<span>Left</span>
		<Separator.Separator orientation="vertical" class="h-5 border-l" />
		<span>Right</span>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">
		Inspect <code>role="separator"</code> with <code>aria-orientation</code>.
	</p>
</div>
