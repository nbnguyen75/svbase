<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		/** Fired with the next state whenever the checkbox is ticked or unticked. */
		onCheckedChange?: ((checked: boolean) => void) | undefined;
		inputRef?: HTMLInputElement | undefined;
		/** Delegated access to the box element. */
		ref?: HTMLElement | undefined;
		/** Initial ticked state for uncontrolled usage. @default false */
		defaultChecked?: boolean;
		/** Mixed state: neither ticked nor unticked. @default false */
		indeterminate?: boolean;
		/** Submitted value when unchecked (nothing submitted when omitted). */
		uncheckedValue?: string;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		required?: boolean;
		readOnly?: boolean;
		children?: Snippet;
		/** Whether the checkbox is ticked (controlled). */
		checked?: boolean;
		/** Submitted value when checked (native `"on"` when omitted). */
		value?: string;
		/** Form field name. Omit to exclude from submission. */
		name?: string;
		form?: string;
		/** Applied to the hidden input for native `<label for>` association. */
		id?: string | undefined;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { getCheckableDataAttributes } from '../../utils/state-attrs.js';
	import { Button } from '../button/index.js';
	import { HiddenInput } from '../hidden-input/index.js';

	import { setCheckboxState } from './context.js';

	type RootMouseEvent = Parameters<NonNullable<RootProps['onclick']>>[0];
	type RootKeyboardEvent = Parameters<NonNullable<RootProps['onkeydown']>>[0];

	let {
		defaultChecked = false,
		checked = $bindable(defaultChecked),
		disabled = false,
		indeterminate = false,
		readOnly = false,
		required = false,
		name = undefined,
		value = undefined,
		uncheckedValue = undefined,
		form = undefined,
		id = undefined,
		inputRef = $bindable<HTMLInputElement | undefined>(undefined),
		onCheckedChange = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	setCheckboxState({
		get checked() {
			return checked;
		},
		get indeterminate() {
			return indeterminate;
		},
		get disabled() {
			return disabled;
		},
		get readOnly() {
			return readOnly;
		},
		get required() {
			return required;
		}
	});

	const dataAttrs = $derived(
		getCheckableDataAttributes({ checked, indeterminate, disabled, readOnly, required })
	);

	function commit(next: boolean): void {
		onCheckedChange?.(next);
		checked = next;
	}

	function activateBox(): void {
		if (readOnly) return;
		// An indeterminate checkbox always resolves to checked, like native.
		commit(!checked);
	}

	function handleNativeChange(next: boolean): void {
		if (next !== checked) commit(next);
	}

	function suppressEnter(event: RootKeyboardEvent): void {
		if (event.key !== 'Enter') return;
		// Enter never toggles a checkbox; it submits the surrounding form.
		event.preventDefault();
		inputRef?.form?.requestSubmit();
	}
</script>

<Button
	{...rest}
	element="span"
	role="checkbox"
	{disabled}
	bind:ref
	aria-checked={indeterminate ? 'mixed' : checked}
	{...dataAttrs}
	onkeydown={composeHandlers(rest.onkeydown, suppressEnter)}
	onclick={composeHandlers(rest.onclick, activateBox)}
>
	{@render children?.()}
</Button>
<HiddenInput
	{checked}
	{indeterminate}
	{disabled}
	{readOnly}
	{name}
	{value}
	{uncheckedValue}
	{form}
	{required}
	{id}
	bind:inputRef
	onNativeChange={handleNativeChange}
/>
