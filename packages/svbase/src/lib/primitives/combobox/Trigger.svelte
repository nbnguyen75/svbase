<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button } from '../button/index.js';

	import { getComboboxRootState } from './context.js';

	let {
		disabled = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const state = getComboboxRootState();

	const disabledEff = $derived(disabled || state.disabled);

	function handleClick(): void {
		if (disabledEff) return;
		state.toggleMenu();
		state.focusInput();
	}

	function keepInputFocus(event: MouseEvent): void {
		// Keep focus in the textbox so typing can continue uninterrupted.
		event.preventDefault();
	}
</script>

<Button
	{...rest}
	element="span"
	role="button"
	tabindex={-1}
	aria-hidden="true"
	disabled={disabledEff}
	bind:ref
	aria-expanded={state.open}
	aria-controls={state.contentId ?? state.defaultContentId}
	onclick={composeHandlers(rest.onclick, handleClick)}
	onmousedown={composeHandlers(rest.onmousedown, keepInputFocus)}
>
	{@render children?.()}
</Button>
