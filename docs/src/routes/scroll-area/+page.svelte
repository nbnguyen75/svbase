<script lang="ts">
	import { ScrollArea } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { card, code, lead, list, note, page, kbd, h1, h2, h3 } from '../docs.js';

	const lines = Array.from({ length: 30 }, (_, index) => `Line ${index + 1}`);

	const anatomy = `<script>
  import { ScrollArea } from 'svbase';
<\/script>

<ScrollArea.Root>
  <ScrollArea.Viewport style="height: 200px;">
    Long content…
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar>
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'Viewport',
			type: 'component',
			defaultValue: '—',
			description: 'Scrollable region. Keyboard-focusable; set height via style.'
		},
		{
			name: 'Scrollbar orientation',
			type: "'horizontal' | 'vertical'",
			defaultValue: "'vertical'",
			description: 'Scroll axis. Hidden automatically without overflow.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Scroll Area</h1>
	<p class={lead}>Native scrolling with a custom thumb and track. Style the parts with CSS.</p>

	<div class={card}>
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
		<p class={note}>Drag the thumb, click the track, or Tab in and scroll with keys.</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>ScrollArea parts</h3>
	<ApiTable props={rootProps} />
	<p class={note}>
		Thumb geometry (<code class={code}>height/width/top/left</code> percentages) is set inline as functional
		positioning — bring your own colors and thickness.
	</p>

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>
			The viewport is focusable (<span class={kbd}>Tab</span>); arrows/PageUp/PageDown scroll
			natively.
		</li>
		<li>The thumb itself is never in the Tab order.</li>
	</ul>
</div>
