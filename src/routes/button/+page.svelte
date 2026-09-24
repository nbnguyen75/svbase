<script lang="ts">
	import { Button } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import {
		btnOutline,
		demoRow,
		card,
		code,
		lead,
		list,
		note,
		page,
		btn,
		h1,
		h2,
		h3
	} from '../docs.js';

	let buttonClicks = $state(0);

	const anatomy = `<script>
  import { Button } from 'svbase';
<\/script>

<Button onclick={() => console.log('clicked')}>
  Save changes
</Button>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'disabled',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Whether user interaction is ignored.'
		},
		{
			name: 'focusableWhenDisabled',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Keep the button focusable when disabled, exposing aria-disabled instead.'
		},
		{
			name: 'element',
			type: 'string',
			defaultValue: "'button'",
			description:
				'Underlying element tag. Non-button tags get role="button" plus Enter/Space handling.'
		},
		{
			name: 'type',
			type: "'button' | 'submit' | 'reset'",
			defaultValue: "'button'",
			description: 'Native button type. Only applied when rendering a native button.'
		},
		{
			name: 'ref',
			type: 'HTMLElement',
			defaultValue: '—',
			description: 'Two-way bound access to the underlying DOM element.'
		},
		{
			name: 'children',
			type: 'Snippet',
			defaultValue: '—',
			description: 'Button content.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Button</h1>
	<p class={lead}>Unstyled button with disabled handling and element delegation.</p>

	<div class={card}>
		<div class={demoRow}>
			<Button class={btn} onclick={() => (buttonClicks += 1)}>Clicked {buttonClicks}×</Button>
			<Button class={btnOutline} disabled>Disabled (not focusable)</Button>
			<Button class={btnOutline} disabled focusableWhenDisabled>Disabled but focusable</Button>
			<Button class={btnOutline} element="div">Div as button (Tab to it, press Enter/Space)</Button>
		</div>
		<p class={note}>
			Inspect: native buttons carry <code class={code}>type="button"</code>; disabled ones carry
			<code class={code}>data-disabled</code>.
		</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>Button</h3>
	<ApiTable props={rootProps} />

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>Native buttons activate on Enter and Space natively.</li>
		<li>
			Non-native elements (<code class={code}>element</code> other than button) activate on Enter keydown
			and Space keyup, matching native timing.
		</li>
		<li>Disabled buttons ignore interaction; consumer handlers can veto via preventDefault.</li>
	</ul>
</div>
