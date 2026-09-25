<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface LinkProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		/** Destination URL. */
		href?: string | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored (OR-ed with toolbar). @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getToolbarState } from './context.js';

	let {
		disabled: disabledProp = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: LinkProps = $props();

	const toolbar = getToolbarState();

	const disabled = $derived(disabledProp || toolbar.disabled);

	type LinkKeyboardEvent = Parameters<NonNullable<LinkProps['onkeydown']>>[0];
	type LinkClickEvent = Parameters<NonNullable<LinkProps['onclick']>>[0];

	onMount(() => {
		toolbar.register({
			get disabled() {
				return disabled;
			},
			focusable: true,
			get element() {
				return ref;
			}
		});
		return () => toolbar.unregister(ref);
	});

	function handleKeys(event: LinkKeyboardEvent): void {
		if (disabled) return;
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'ArrowUp':
			case 'ArrowDown':
			case 'Home':
			case 'End':
				event.preventDefault();
				toolbar.moveFocus(event.currentTarget as HTMLElement, event.key);
				return;
		}
	}

	function handleClick(event: LinkClickEvent): void {
		if (disabled) event.preventDefault();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<a
	{...rest}
	bind:this={ref}
	tabindex={toolbar.isTabStop(ref) ? 0 : -1}
	aria-disabled={disabled ? 'true' : undefined}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
	onclick={composeHandlers(rest.onclick, handleClick)}
>
	{@render children?.()}
</a>
