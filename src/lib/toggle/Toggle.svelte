<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface ToggleProps extends HTMLButtonAttributes {
		/** Fired with the next state whenever the toggle is activated. */
		onPressedChange?: ((pressed: boolean) => void) | undefined;
		/** Delegated access to the underlying DOM element. */
		ref?: HTMLElement | undefined;
		/**
		 * Initial pressed state for uncontrolled usage.
		 * @default false
		 */
		defaultPressed?: boolean;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/**
		 * Whether the toggle is pressed (controlled). Omit for uncontrolled
		 * usage with `defaultPressed`, optionally combined with
		 * `bind:pressed` for two-way binding.
		 */
		pressed?: boolean;
		/** Underlying element tag, forwarded to Button. @default 'button' */
		element?: string;
	}
</script>

<script lang="ts">
	import { Button } from '../button/index.js';
	import { composeHandlers } from '../internal/compose-handlers.js';

	type ToggleMouseEvent = Parameters<NonNullable<ToggleProps['onclick']>>[0];

	let {
		defaultPressed = false,
		pressed = $bindable(defaultPressed),
		disabled = false,
		element = 'button',
		onPressedChange,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ToggleProps = $props();

	/**
	 * Runs after the consumer's click handler via composition order, so
	 * `event.preventDefault()` in `onclick` vetoes the state flip — the
	 * Svelte-native equivalent of Base UI's cancelable change details.
	 */
	function flip(): void {
		const next = !pressed;
		onPressedChange?.(next);
		pressed = next;
	}
</script>

<Button
	{...rest}
	{disabled}
	{element}
	bind:ref
	type="button"
	aria-pressed={pressed}
	data-pressed={pressed ? '' : undefined}
	onclick={composeHandlers<ToggleMouseEvent>(rest.onclick, flip)}
>
	{@render children?.()}
</Button>
