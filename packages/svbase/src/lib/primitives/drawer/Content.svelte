<script lang="ts" module>
	import type { ContentProps as DialogContentProps } from '../dialog/index.js';

	export type ContentProps = DialogContentProps;
</script>

<script lang="ts">
	import { Content as DialogContent } from '../dialog/index.js';

	import { getDrawerState } from './context.js';

	let { children, ...rest }: ContentProps = $props();

	const drawer = getDrawerState();

	// Structural edge anchoring only (position + orientation span) — all
	// visual styling stays consumer-owned, matching the dialog convention.
	const sideClasses = $derived.by(() => {
		switch (drawer.side) {
			case 'left':
				return 'fixed top-0 bottom-0 left-0';
			case 'top':
				return 'fixed top-0 right-0 left-0';
			case 'bottom':
				return 'fixed right-0 bottom-0 left-0';
			case 'right':
			default:
				return 'fixed top-0 right-0 bottom-0';
		}
	});
</script>

<DialogContent
	{...rest}
	data-side={drawer.side}
	class={`${sideClasses} ${typeof rest.class === 'string' ? rest.class : ''}`}
>
	{@render children?.()}
</DialogContent>
