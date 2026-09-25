<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface InputProps extends Omit<
		HTMLInputAttributes,
		'value' | 'defaultValue' | 'children'
	> {
		/** Fired with the next value on every committed change. */
		onValueChange?: ((value: string) => void) | undefined;
		inputRef?: HTMLInputElement | undefined;
		/** Form field name. Falls back to the enclosing Field's name. Omit to exclude from submission. */
		name?: string | undefined;
		/** Applied to the input for native `<label for>` association. Falls back to the Field control id. */
		id?: string | undefined;
		/** Initial value for uncontrolled usage. @default '' */
		defaultValue?: string;
		/** Current value (controlled). */
		value?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { optionalContext } from '../../utils/context.js';
	import { createId } from '../../utils/id.js';
	import { getFieldState } from '../field/context.js';

	let {
		defaultValue = '',
		value = $bindable(defaultValue),
		name = undefined,
		id = undefined,
		type = 'text',
		required = false,
		disabled = false,
		readonly: readOnly = false,
		inputRef = $bindable<HTMLInputElement | undefined>(undefined),
		onValueChange = undefined,
		...rest
	}: InputProps = $props();

	const field = optionalContext(getFieldState);

	const fallbackId = createId('input');
	const resolvedId = $derived(id ?? field?.controlId ?? fallbackId);
	const resolvedName = $derived(name ?? field?.name);
	const disabledEff = $derived(disabled || field?.disabled === true);
	const showInvalid = $derived(field?.valid === false);

	type InputElementEvent = Event & { currentTarget: EventTarget & HTMLInputElement };
	type FocusElementEvent = FocusEvent & { currentTarget: EventTarget & HTMLInputElement };

	function handleValueEvent(event: InputElementEvent): void {
		const element = event.currentTarget;
		if (element.value !== value) {
			value = element.value;
			onValueChange?.(value);
		}
		field?.handleChange();
	}

	onMount(() => {
		if (!field || !inputRef) return;
		field.registerControl({ element: () => inputRef ?? null, getValue: () => value });
		return () => field.unregisterControl();
	});
</script>

<input
	{...rest}
	bind:this={inputRef}
	id={resolvedId}
	name={resolvedName}
	{type}
	{value}
	{required}
	disabled={disabledEff ? true : undefined}
	readonly={readOnly ? true : undefined}
	aria-invalid={showInvalid ? true : undefined}
	aria-describedby={field?.getDescribedBy()}
	data-valid={field?.valid === true ? '' : undefined}
	data-invalid={showInvalid ? '' : undefined}
	oninput={composeHandlers<InputElementEvent>(rest.oninput, handleValueEvent)}
	onchange={composeHandlers<InputElementEvent>(rest.onchange, handleValueEvent)}
	onfocus={composeHandlers<FocusElementEvent>(rest.onfocus, () => field?.handleFocus())}
	onblur={composeHandlers<FocusElementEvent>(rest.onblur, () => field?.handleBlur())}
/>
