<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface ButtonProps extends HTMLButtonAttributes {
		children?: Snippet;
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored (OR-ed with toolbar). @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button as BaseButton } from '../button/index.js';

	import { getToolbarState } from './context.js';

	let {
		disabled: disabledProp = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ButtonProps = $props();

	const toolbar = getToolbarState();

	const disabled = $derived(disabledProp || toolbar.disabled);

	type ButtonKeyboardEvent = Parameters<NonNullable<ButtonProps['onkeydown']>>[0];

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

	function handleKeys(event: ButtonKeyboardEvent): void {
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
</script>

<BaseButton
	{...rest}
	{disabled}
	bind:ref
	tabindex={toolbar.isTabStop(ref) ? 0 : -1}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
>
	{@render children?.()}
</BaseButton>
