<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface InputProps extends Omit<
		HTMLInputAttributes,
		'value' | 'defaultValue' | 'children' | 'role'
	> {
		inputRef?: HTMLInputElement | undefined;
		/** Applied to the input for native `<label for>` association. Falls back to a generated id. */
		id?: string | undefined;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { createId } from '../../utils/id.js';
	import { optionalContext } from '../../utils/context.js';
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { getFieldState } from '../field/context.js';

	import { getComboboxRootState } from './context.js';

	let {
		id = undefined,
		required = false,
		disabled = false,
		readonly: readOnly = false,
		inputRef = $bindable<HTMLInputElement | undefined>(undefined),
		...rest
	}: InputProps = $props();

	const state = getComboboxRootState();
	const field = optionalContext(getFieldState);

	const fallbackId = createId('combobox-input');
	const resolvedId = $derived(id ?? fallbackId);
	const disabledEff = $derived(disabled || state.disabled);
	const activeDescendantId = $derived(
		state.highlightedValue === undefined
			? undefined
			: (state.entries.find((item) => item.value === state.highlightedValue)?.id ?? undefined)
	);

	type InputElementEvent = Event & { currentTarget: EventTarget & HTMLInputElement };
	type InputKeyboardEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement };

	onMount(() => {
		state.registerInput(inputRef ?? undefined);
		if (field && inputRef) {
			field.registerControl({
				element: () => inputRef ?? null,
				getValue: () => state.value
			});
		}
		return () => {
			state.registerInput(undefined);
			field?.unregisterControl();
		};
	});

	function currentHighlight(): string {
		return state.highlightedValue ?? '';
	}

	function handleInput(event: InputElementEvent): void {
		if (disabledEff || readOnly) return;
		state.setFilter(event.currentTarget.value);
		if (!state.open) state.openMenu();
		field?.handleChange();
	}

	function handleKeys(event: InputKeyboardEvent): void {
		if (disabledEff) return;
		const target = event.currentTarget;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				event.preventDefault();
				if (!state.open) {
					state.openMenu();
					return;
				}
				state.moveHighlight(currentHighlight(), event.key, target);
				return;
			case 'Home':
			case 'End':
				if (!state.open) return;
				event.preventDefault();
				state.moveHighlight(currentHighlight(), event.key, target);
				return;
			case 'Enter':
				if (!state.open) {
					state.openMenu();
					return;
				}
				event.preventDefault();
				if (state.freeInput) {
					state.commitFreeText();
				} else {
					const highlighted = state.highlightedValue;
					if (highlighted === undefined) return;
					state.select(highlighted);
					state.closeMenu();
				}
				field?.handleChange();
				return;
			case 'Escape':
				if (!state.open) return;
				event.preventDefault();
				if (!state.freeInput) state.revertText();
				state.dismiss();
				return;
			case 'Tab':
				if (!state.open) return;
				if (!state.freeInput) state.revertText();
				state.dismiss();
				return;
		}
	}

	function handleBlur(): void {
		if (!state.open) return;
		if (!state.freeInput) state.revertText();
		state.dismiss();
		field?.handleBlur();
	}

	function handleFocus(): void {
		field?.handleFocus();
	}
</script>

<input
	{...rest}
	bind:this={inputRef}
	id={resolvedId}
	role="combobox"
	aria-expanded={state.open}
	aria-controls={state.contentId ?? state.defaultContentId}
	aria-activedescendant={activeDescendantId}
	value={state.filter}
	{required}
	disabled={disabledEff ? true : undefined}
	readonly={readOnly ? true : undefined}
	aria-invalid={field && field.valid === false ? true : undefined}
	aria-describedby={field?.getDescribedBy()}
	data-valid={field?.valid === true ? '' : undefined}
	data-invalid={field && field.valid === false ? '' : undefined}
	autocomplete="off"
	autocapitalize="off"
	autocorrect="off"
	spellcheck={false}
	{@attach state.position.reference}
	oninput={composeHandlers(rest.oninput, handleInput)}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
	onblur={composeHandlers(rest.onblur, handleBlur)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
/>
