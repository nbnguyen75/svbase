<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface ButtonProps extends HTMLButtonAttributes {
		/**
		 * Keep the button focusable when disabled, exposing `aria-disabled`
		 * instead of the native `disabled` attribute.
		 * @default false
		 */
		focusableWhenDisabled?: boolean;
		/** Delegated access to the underlying DOM element. */
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored. */
		disabled?: boolean;
		children?: Snippet;
		/**
		 * Underlying element tag (element delegation). Any tag other than
		 * `button` gets `role="button"`, a roving `tabindex`, and
		 * Enter/Space activation.
		 * @default 'button'
		 */
		element?: string;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../internal/compose-handlers.js';

	type ButtonMouseEvent = Parameters<NonNullable<ButtonProps['onclick']>>[0];
	type ButtonKeyboardEvent = Parameters<NonNullable<ButtonProps['onkeydown']>>[0];

	let {
		disabled = false,
		focusableWhenDisabled = false,
		type = 'button',
		element = 'button',
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ButtonProps = $props();

	const isNative = $derived(element === 'button');

	/**
	 * `type`/`disabled` are not known props of `<svelte:element>`, so they
	 * travel via spread (which skips excess-property checks). Non-native
	 * elements must never carry them.
	 */
	const nativeAttrs = $derived(
		isNative ? { type, disabled: disabled && !focusableWhenDisabled ? true : undefined } : {}
	);

	/**
	 * Runs before the consumer's click handler: a disabled button consumes
	 * the event so neither consumer logic nor (non-native) activation runs.
	 */
	function guardClick(event: ButtonMouseEvent): void {
		if (disabled) event.preventDefault();
	}

	/**
	 * Enter/Space activation for non-native elements. Native buttons handle
	 * this themselves; Space keydown only cancels page scroll here because
	 * activation follows on keyup, matching native behavior.
	 */
	function activateKeydown(event: ButtonKeyboardEvent): void {
		if (disabled || isNative) return;
		if (event.key === 'Enter') {
			event.preventDefault();
			if (event.currentTarget instanceof HTMLElement) event.currentTarget.click();
		} else if (event.key === ' ') {
			event.preventDefault();
		}
	}

	function activateKeyup(event: ButtonKeyboardEvent): void {
		if (disabled || isNative || event.key !== ' ' || event.defaultPrevented) return;
		if (event.currentTarget instanceof HTMLElement) event.currentTarget.click();
	}
</script>

<svelte:element
	this={element}
	{...rest}
	{...nativeAttrs}
	bind:this={ref}
	aria-disabled={disabled && (!isNative || focusableWhenDisabled) ? 'true' : rest['aria-disabled']}
	role={rest.role ?? (isNative ? undefined : 'button')}
	tabindex={isNative
		? rest.tabindex
		: disabled && !focusableWhenDisabled
			? -1
			: (rest.tabindex ?? 0)}
	data-disabled={disabled ? '' : undefined}
	onclick={composeHandlers<ButtonMouseEvent>(guardClick, rest.onclick)}
	onkeydown={composeHandlers<ButtonKeyboardEvent>(rest.onkeydown, activateKeydown)}
	onkeyup={composeHandlers<ButtonKeyboardEvent>(rest.onkeyup, activateKeyup)}
>
	{@render children?.()}
</svelte:element>
