<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface InputProps extends Omit<
		HTMLInputAttributes,
		'value' | 'defaultValue' | 'children' | 'type' | 'inputmode'
	> {
		inputRef?: HTMLInputElement | undefined;
		/** Applied to the input for native `<label for>` association. Falls back to a generated id. */
		id?: string | undefined;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { optionalContext } from '../../utils/context.js';
	import { createId } from '../../utils/id.js';
	import { getFieldState } from '../field/context.js';

	import { getNumberFieldState } from './context.js';

	let {
		id = undefined,
		required = false,
		disabled = false,
		readonly: readOnly = false,
		placeholder = undefined,
		inputRef = $bindable<HTMLInputElement | undefined>(undefined),
		...rest
	}: InputProps = $props();

	const root = getNumberFieldState();
	const field = optionalContext(getFieldState);

	const fallbackId = createId('number-field');
	const resolvedId = $derived(id ?? fallbackId);
	const disabledEff = $derived(disabled || root.disabled);
	const readOnlyEff = $derived(readOnly || root.readOnly);

	let text = $state('');

	type InputElementEvent = Event & { currentTarget: EventTarget & HTMLInputElement };
	type InputKeyboardEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement };

	onMount(() => {
		text = root.value === null ? '' : String(root.value);
		root.registerInput(inputRef ?? undefined);
		if (field && inputRef) {
			field.registerControl({ element: () => inputRef ?? null, getValue: () => root.value });
		}
		return () => {
			root.registerInput(undefined);
			field?.unregisterControl();
		};
	});

	// Sync external value changes, but never clobber mid-typing.
	$effect(() => {
		const current = root.value;
		if (document.activeElement !== inputRef) text = current === null ? '' : String(current);
	});

	function commit(): void {
		const committed = root.commitText(text);
		text = committed === null ? '' : String(committed);
		field?.handleChange();
	}

	function handleInput(event: InputElementEvent): void {
		text = event.currentTarget.value;
	}

	function handleChange(): void {
		if (inputRef) text = inputRef.value;
		commit();
	}

	function handleKeys(event: InputKeyboardEvent): void {
		if (disabledEff || readOnlyEff) return;
		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				root.increment();
				syncText();
				field?.handleChange();
				return;
			case 'ArrowDown':
				event.preventDefault();
				root.decrement();
				syncText();
				field?.handleChange();
				return;
			case 'PageUp':
				event.preventDefault();
				stepLarge(1);
				return;
			case 'PageDown':
				event.preventDefault();
				stepLarge(-1);
				return;
			case 'Home':
				if (root.min === undefined) return;
				event.preventDefault();
				setExact(root.min);
				return;
			case 'End':
				if (root.max === undefined) return;
				event.preventDefault();
				setExact(root.max);
				return;
			case 'Enter':
				commit();
				return;
		}
	}

	function stepLarge(direction: 1 | -1): void {
		const base = root.value ?? root.min ?? 0;
		setExact(base + direction * root.largeStep);
	}

	function setExact(candidate: number): void {
		// Route through commitText for shared clamp behavior.
		const committed = root.commitText(String(candidate));
		text = committed === null ? '' : String(committed);
		field?.handleChange();
	}

	function syncText(): void {
		const current = root.value;
		text = current === null ? '' : String(current);
	}

	function handleBlur(): void {
		commit();
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
	type="text"
	inputmode="decimal"
	role="spinbutton"
	aria-valuenow={root.value ?? undefined}
	aria-valuemin={root.min}
	aria-valuemax={root.max}
	aria-invalid={field && field.valid === false ? true : undefined}
	aria-describedby={field?.getDescribedBy()}
	data-valid={field?.valid === true ? '' : undefined}
	data-invalid={field && field.valid === false ? '' : undefined}
	value={text}
	{placeholder}
	{required}
	disabled={disabledEff ? true : undefined}
	readonly={readOnlyEff ? true : undefined}
	oninput={composeHandlers(rest.oninput, handleInput)}
	onchange={composeHandlers(rest.onchange, handleChange)}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
	onblur={composeHandlers(rest.onblur, handleBlur)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
/>
