# svbase

Unstyled, headless UI primitives for Svelte 5. The accessibility of Base UI,
styled your way — zero CSS ships with the library.

- 30+ primitives: dialog, select, combobox, tabs, toast, tooltip, slider, menu, form, and more
- Per-component imports (`svbase/dialog`) plus actions (`svbase/actions`) and utils (`svbase/utils`)
- WAI-ARIA roles, keyboard navigation, and focus management built in
- Svelte 5 runes only; SSR-safe

## Install

```sh
bun add svbase
# pnpm add svbase
# npm install svbase
```

Requires `svelte@^5`. Demos and full API reference: https://svbase.dev

## Usage

```svelte
<script>
	import { Dialog } from 'svbase';
</script>

<Dialog.Root>
	<Dialog.Trigger>Open</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Content>
			<Dialog.Title>Hello</Dialog.Title>
			<Dialog.Description>Unstyled dialog.</Dialog.Description>
			<Dialog.Close>Close</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

Import a single primitive to keep bundles lean:

```svelte
<script>
	import { Dialog } from 'svbase/dialog';
</script>
```

## License

MIT © nbnguyen75
