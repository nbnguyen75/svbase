<script lang="ts">
	import { Separator } from '$lib/index.js';
</script>

<h1>Separator</h1>
<p>Accessible divider with orientation.</p>

<section>
	<p>Above</p>
	<Separator.Separator />
	<p>Below</p>
	<div>
		<span>Left</span>
		<Separator.Separator orientation="vertical" />
		<span>Right</span>
	</div>
	<p>Inspect <code>role="separator"</code> with <code>aria-orientation</code>.</p>
</section>
