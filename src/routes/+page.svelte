<script lang="ts">
	import {
		composeHandlers,
		clickOutside,
		generateId,
		mergeProps,
		escapeKey,
		createId,
		Checkbox,
		Button,
		Portal,
		Switch,
		Toggle
	} from '$lib/index.js';

	let portalOpen = $state(false);
	let dismissedBy = $state('none');
	let composedLog = $state<string[]>([]);
	let mergedLog = $state<string[]>([]);
	let buttonClicks = $state(0);
	let toggleChanges = $state<string[]>([]);
	let checkboxChecked = $state(false);
	let switchChecked = $state(false);
	let switchChanges = $state<string[]>([]);
	let submitted = $state('—');
	let controlledPressed = $state(false);
	let sides: Array<{ note: string; id: string }> = $state([]);

	const demoId = createId('demo');
	const generated = generateId('demo');

	function addSide(note: string): void {
		sides = [...sides, { note, id: generateId('item') }];
	}

	const internalClick = (): void => {
		composedLog = [...composedLog, 'internal'];
	};
	const consumerClick = (): void => {
		composedLog = [...composedLog, 'consumer'];
	};
	const composed = composeHandlers<MouseEvent>(consumerClick, internalClick);

	interface DemoButtonProps {
		onclick: (event: MouseEvent) => void;
		class: string;
	}
	const mergedDemo: DemoButtonProps = mergeProps<DemoButtonProps>(
		{
			class: 'internal',
			onclick: () => {
				mergedLog = [...mergedLog, 'internal'];
			}
		},
		{
			class: 'consumer',
			onclick: () => {
				mergedLog = [...mergedLog, 'consumer'];
			}
		}
	);
</script>

<h1>svbase — feat-002: Core Primitive Utilities</h1>
<p>Demo id: <code>{demoId}</code> / <code>{generated}</code></p>

<section>
	<h2>Button</h2>
	<Button onclick={() => (buttonClicks += 1)}>Clicked {buttonClicks}×</Button>
	<Button disabled>Disabled (not focusable)</Button>
	<Button disabled focusableWhenDisabled>Disabled but focusable</Button>
	<Button element="div">Div as button (Tab to it, press Enter/Space)</Button>
	<p>
		Inspect: native buttons carry <code>type="button"</code>; disabled ones carry
		<code>data-disabled</code>.
	</p>
</section>

<section>
	<h2>Toggle</h2>
	<Toggle
		onPressedChange={(pressed) => {
			toggleChanges = [...toggleChanges, pressed ? 'on' : 'off'];
		}}
	>
		Uncontrolled toggle
	</Toggle>
	<Toggle bind:pressed={controlledPressed}>Controlled: {controlledPressed ? 'on' : 'off'}</Toggle>
	<Toggle disabled>Disabled toggle</Toggle>
	<p>Changes: {toggleChanges.length ? toggleChanges.join(', ') : '—'}</p>
</section>

<section>
	<h2>Checkbox</h2>
	<Checkbox.Root
		onCheckedChange={(checked) => {
			checkboxChecked = checked;
		}}
	>
		<Checkbox.Indicator>✓</Checkbox.Indicator>
		Subscribe (uncontrolled)
	</Checkbox.Root>
	<Checkbox.Root indeterminate>
		<Checkbox.Indicator>✓</Checkbox.Indicator>
		Indeterminate
	</Checkbox.Root>
	<Checkbox.Root disabled>
		<Checkbox.Indicator>✓</Checkbox.Indicator>
		Disabled
	</Checkbox.Root>
	<Checkbox.Root readOnly checked>
		<Checkbox.Indicator>✓</Checkbox.Indicator>
		Read-only
	</Checkbox.Root>
	<p>Last change: {checkboxChecked ? 'checked' : 'unchecked'}</p>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			const data = new FormData(event.currentTarget);
			submitted = `agree=${data.get('agree')} newsletter=${data.get('newsletter')}`;
		}}
	>
		<Checkbox.Root name="agree" value="yes">
			<Checkbox.Indicator>✓</Checkbox.Indicator>
			Agree (required)
		</Checkbox.Root>
		<Checkbox.Root name="newsletter" value="yes" uncheckedValue="no">
			<Checkbox.Indicator>✓</Checkbox.Indicator>
			Newsletter (unchecked submits "no")
		</Checkbox.Root>
		<button type="submit">Submit form</button>
	</form>
	<p>Submitted: <code>{submitted}</code></p>
</section>

<section>
	<h2>Switch</h2>
	<Switch.Root
		bind:checked={switchChecked}
		onCheckedChange={(checked) => {
			switchChanges = [...switchChanges, checked ? 'on' : 'off'];
		}}
	>
		<Switch.Thumb />
		Airplane mode ({switchChecked ? 'on' : 'off'})
	</Switch.Root>
	<Switch.Root disabled>
		<Switch.Thumb />
		Disabled
	</Switch.Root>
	<p>Changes: {switchChanges.length ? switchChanges.join(', ') : '—'}</p>
</section>

<section>
	<h2>Portal</h2>
	<button onclick={() => (portalOpen = !portalOpen)}>Toggle portal content</button>
	{#if portalOpen}
		<Portal>
			<p data-testid="portal-content">
				This paragraph is teleported to <code>document.body</code>. Toggle it, then inspect the DOM.
			</p>
		</Portal>
	{/if}
</section>

<section>
	<h2>clickOutside + escapeKey</h2>
	<p>Dismissed by: <strong>{dismissedBy}</strong></p>
	<button onclick={() => (dismissedBy = 'none')}>Reset</button>
	<div
		role="dialog"
		aria-label="Dismissal demo"
		tabindex="-1"
		{@attach clickOutside(() => (dismissedBy = 'outside'))}
		{@attach escapeKey(() => (dismissedBy = 'escape'))}
	>
		<p>Click outside this box or press Escape. Focus it first for keyboard testing.</p>
	</div>
</section>

<section>
	<h2>composeHandlers</h2>
	<button onclick={composed}>Fire composed handlers</button>
	<button onclick={() => (composedLog = [])}>Clear</button>
	<p>Call order: {composedLog.length ? composedLog.join(' → ') : '—'}</p>
</section>

<section>
	<h2>mergeProps</h2>
	<button class={mergedDemo.class} onclick={mergedDemo.onclick}>Fire merged props</button>
	<button onclick={() => (mergedLog = [])}>Clear</button>
	<p>Merged class: <code>{mergedDemo.class}</code></p>
	<p>Call order: {mergedLog.length ? mergedLog.join(' → ') : '—'}</p>
</section>

<section>
	<h2>generateId</h2>
	<button onclick={() => addSide('new row')}>Add row</button>
	<ul>
		{#each sides as side (side.id)}
			<li>{side.id}: {side.note}</li>
		{/each}
	</ul>
</section>
