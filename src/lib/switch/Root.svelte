<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		/** Fired with the next state whenever the switch is flipped. */
		onCheckedChange?: ((checked: boolean) => void) | undefined;
		inputRef?: HTMLInputElement | undefined;
		/** Delegated access to the switch element. */
		ref?: HTMLElement | undefined;
		/** Initial on state for uncontrolled usage. @default false */
		defaultChecked?: boolean;
		/** Submitted value when off (nothing submitted when omitted). */
		uncheckedValue?: string;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		required?: boolean;
		readOnly?: boolean;
		children?: Snippet;
		/** Whether the switch is on (controlled). */
		checked?: boolean;
		/** Submitted value when on (native `"on"` when omitted). */
		value?: string;
		/** Form field name. Omit to exclude from submission. */
		name?: string;
		form?: string;
		/** Applied to the hidden input for native `<label for>` association. */
		id?: string;
	}
</script>

<script lang="ts">
	import { Button } from '../button/index.js';
	import { composeHandlers } from '../internal/compose-handlers.js';
	import HiddenInput from '../internal/HiddenInput.svelte';
	import { getCheckableDataAttributes } from '../internal/state-attrs.js';

	import { setSwitchState } from './context.js';

	type RootMouseEvent = Parameters<NonNullable<RootProps['onclick']>>[0];

	let {
		defaultChecked = false,
		checked = $bindable(defaultChecked),
		disabled = false,
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

	setSwitchState({
		get checked() {
			return checked;
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

	const dataAttrs = $derived(getCheckableDataAttributes({ checked, disabled, readOnly, required }));

	function commit(next: boolean): void {
		onCheckedChange?.(next);
		checked = next;
	}

	function activateSwitch(): void {
		if (readOnly) return;
		commit(!checked);
	}

	function handleNativeChange(next: boolean): void {
		if (next !== checked) commit(next);
	}
</script>

<Button
	{...rest}
	element="span"
	role="switch"
	{disabled}
	bind:ref
	aria-checked={checked}
	{...dataAttrs}
	onclick={composeHandlers(rest.onclick, activateSwitch)}
>
	{@render children?.()}
</Button>
<HiddenInput
	{checked}
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
