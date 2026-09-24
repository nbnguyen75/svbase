<script lang="ts">
	import { DropdownMenu as Menu } from 'svbase';

	import ApiTable, { type ApiProp } from '../ApiTable.svelte';
	import CodeBlock from '../CodeBlock.svelte';
	import { card, code, lead, list, note, page, kbd, h1, h2, h3 } from '../docs.js';

	let eatCount = $state(0);

	const anatomy = `<script>
  import { DropdownMenu as Menu } from 'svbase';
<\/script>

<Menu.Root>
  <Menu.Trigger>File</Menu.Trigger>
  <Menu.Portal>
    <Menu.Content>
      <Menu.Item>New</Menu.Item>
      <Menu.Separator />
      <Menu.CheckboxItem>Show sidebar</Menu.CheckboxItem>
    </Menu.Content>
  </Menu.Portal>
</Menu.Root>`;

	const rootProps: Array<ApiProp> = [
		{
			name: 'open',
			type: 'boolean',
			defaultValue: '—',
			description: 'Controlled open state. Omit for uncontrolled usage.'
		},
		{
			name: 'placement',
			type: 'Placement',
			defaultValue: "'bottom-start'",
			description: 'Preferred placement; flips on viewport collision.'
		},
		{
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			defaultValue: '—',
			description: 'Fired with the next state on every open or close.'
		}
	];
</script>

<div class={page}>
	<h1 class={h1}>Dropdown Menu</h1>
	<p class={lead}>Menu with roving focus, typeahead, checks, radios, and a submenu.</p>

	<div class={card}>
		<Menu.Root>
			<Menu.Trigger>File</Menu.Trigger>
			<Menu.Portal>
				<Menu.Content
					class="min-w-48 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
				>
					<Menu.Item
						class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
						onSelect={() => {
							eatCount += 1;
						}}
					>
						New
					</Menu.Item>
					<Menu.Item class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">Open</Menu.Item>
					<Menu.Item disabled class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
						Save
					</Menu.Item>
					<Menu.Separator class="my-1 border-t" />
					<Menu.CheckboxItem class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
						<Menu.CheckboxIndicator>✓</Menu.CheckboxIndicator>
						Show sidebar
					</Menu.CheckboxItem>
					<Menu.RadioGroup defaultValue="a">
						<Menu.RadioItem
							value="a"
							class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
						>
							<Menu.RadioIndicator>●</Menu.RadioIndicator>
							Option A
						</Menu.RadioItem>
						<Menu.RadioItem
							value="b"
							class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
						>
							<Menu.RadioIndicator>●</Menu.RadioIndicator>
							Option B
						</Menu.RadioItem>
					</Menu.RadioGroup>
					<Menu.SubRoot>
						<Menu.SubTrigger class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
							Share
						</Menu.SubTrigger>
						<Menu.Portal>
							<Menu.Content class="min-w-40 rounded-lg border bg-popover p-1 shadow-md">
								<Menu.Item class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
									Email
								</Menu.Item>
								<Menu.Item class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
									Copy link
								</Menu.Item>
							</Menu.Content>
						</Menu.Portal>
					</Menu.SubRoot>
				</Menu.Content>
			</Menu.Portal>
		</Menu.Root>
		<p class={note}>
			New clicked {eatCount}×. Type a letter to jump; arrows move; hover Share for the submenu.
		</p>
	</div>

	<h2 class={h2}>Anatomy</h2>
	<CodeBlock code={anatomy} />

	<h2 class={h2}>API reference</h2>
	<h3 class={h3}>DropdownMenu.Root</h3>
	<ApiTable props={rootProps} />
	<p class={note}>
		Item clicks close the menu; <code class={code}>CheckboxItem</code> and
		<code class={code}>RadioItem</code> stay open. Highlighted items carry
		<code class={code}>data-highlighted</code> for styling.
	</p>

	<h2 class={h2}>Keyboard interactions</h2>
	<ul class={list}>
		<li>
			<span class={kbd}>↑</span><span class={kbd}>↓</span> move focus and highlight;
			<span class={kbd}>Home</span> / <span class={kbd}>End</span> jump; type to search.
		</li>
		<li>
			<span class={kbd}>Enter</span> / <span class={kbd}>Space</span> selects;
			<span class={kbd}>Esc</span> closes one level; <span class={kbd}>Tab</span> dismisses.
		</li>
		<li>Submenu: hover or <span class={kbd}>→</span> opens, <span class={kbd}>←</span> closes.</li>
	</ul>
</div>
