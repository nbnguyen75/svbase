<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface InputProps extends Omit<
		HTMLInputAttributes,
		'value' | 'defaultValue' | 'children' | 'type' | 'inputmode' | 'maxlength' | 'minlength'
	> {
		inputRef?: HTMLInputElement | undefined;
		/** Applied to the input for native `<label for>` association. Falls back to a generated id. */
		id?: string | undefined;
		/** Zero-based segment index within the code. */
		index: number;
		/**
		 * Allowed characters as a regex source (tested per character).
		 * @default '\\d'
		 */
		allowedPattern?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { createId } from '../../utils/id.js';
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getOtpState } from './context.js';

	let {
		index,
		allowedPattern = '\\d',
		id = undefined,
		disabled = false,
		readonly: readOnly = false,
		inputRef = $bindable<HTMLInputElement | undefined>(undefined),
		...rest
	}: InputProps = $props();

	const state = getOtpState();

	const fallbackId = createId('otp-input');
	const resolvedId = $derived(id ?? fallbackId);
	const disabledEff = $derived(disabled || state.disabled);
	const readOnlyEff = $derived(readOnly || state.readOnly);
	const pattern = $derived.by(() => {
		try {
			return new RegExp(`^(?:${allowedPattern})$`);
		} catch {
			return /$^/;
		}
	});

	const display = $derived(state.value.charAt(index));

	onMount(() => {
		state.registerInput(index, inputRef ?? undefined);
		return () => state.registerInput(index, undefined);
	});

	type InputElementEvent = Event & { currentTarget: EventTarget & HTMLInputElement };
	type InputKeyboardEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement };
	type InputClipboardEvent = ClipboardEvent & { currentTarget: EventTarget & HTMLInputElement };

	function takeLast(text: string): string {
		const char = text.slice(-1);
		return char !== '' && pattern.test(char) ? char : '';
	}

	function handleInput(event: InputElementEvent): void {
		if (disabledEff || readOnlyEff) return;
		const char = takeLast(event.currentTarget.value);
		// Reset the DOM value first: the display is fully derived from state,
		// so mobile keyboards composing multiple characters collapse cleanly.
		event.currentTarget.value = state.value.charAt(index);
		if (char === '') return;
		state.setChar(index, char);
	}

	function handleKeys(event: InputKeyboardEvent): void {
		if (disabledEff || readOnlyEff) return;
		switch (event.key) {
			case 'Backspace':
				event.preventDefault();
				state.clearChar(index);
				return;
			case 'ArrowLeft':
				event.preventDefault();
				state.focusIndex(index - 1);
				return;
			case 'ArrowRight':
				event.preventDefault();
				state.focusIndex(index + 1);
				return;
			case 'Delete':
				event.preventDefault();
				// Delete clears in place without moving (unlike Backspace).
				if (state.value.charAt(index) !== '') state.clearChar(index);
				return;
		}
	}

	function handlePaste(event: InputClipboardEvent): void {
		if (disabledEff || readOnlyEff) return;
		const text = event.clipboardData?.getData('text') ?? '';
		const filtered = Array.from(text)
			.filter((char) => pattern.test(char))
			.join('');
		if (filtered === '') return;
		event.preventDefault();
		state.pasteText(index, filtered);
	}
</script>

<input
	{...rest}
	bind:this={inputRef}
	id={resolvedId}
	type="text"
	inputmode="numeric"
	maxlength={1}
	autocomplete={index === 0 ? 'one-time-code' : undefined}
	aria-label={rest['aria-label'] ?? `Digit ${index + 1} of ${state.length}`}
	value={display}
	disabled={disabledEff ? true : undefined}
	readonly={readOnlyEff ? true : undefined}
	oninput={composeHandlers(rest.oninput, handleInput)}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
	onpaste={composeHandlers(rest.onpaste, handlePaste)}
/>
