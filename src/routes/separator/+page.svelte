<script lang="ts">
	import { Separator } from '$lib/index.js';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { card, code, lead, list, note, page, h1, h2, h3 } from '../docs.js';

	const anatomy = `<script>
  import { Separator } from 'svbase';
<\/script>

<Separator.Separator />`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'orientation',
			type: "'horizontal' | 'vertical'",
			defaultValue: "'horizontal'",
			description: 'Reading direction of the divider.'
		},
		{
			name: 'ref',
			type: 'HTMLDivElement',
			defaultValue: '—',
			description: 'Two-way bound access to the underlying DOM element.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Separator</h1>
	<p class={lead}>Accessible divider with orientation.</p>

	<div class={card}>
		<p>Above</p>
		<Separator.Separator class="my-4 border-t" />
		<p>Below</p>
		<div class="flex items-center gap-3">
			<span>Left</span>
			<Separator.Separator orientation="vertical" class="h-5 border-l" />
			<span>Right</span>
		</div>
		<p class={note}>
			Inspect <code class={code}>role="separator"</code> with
			<code class={code}>aria-orientation</code>.
		</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Separator.Separator</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>None — separators are never focusable.</li>
	</ul>
</div>
