<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ItemProps extends HTMLAttributes<HTMLElement> {
		inputRef?: HTMLInputElement | undefined;
		/** Delegated access to the item element. */
		ref?: HTMLElement | undefined;
		/** Whether this item is skipped by interaction and arrows. @default false */
		disabled?: boolean;
		readOnly?: boolean;
		required?: boolean;
		children?: Snippet;
		/** Unique identifying value within the group. */
		value: string;
		/** Applied to the hidden input for native `<label for>` association. */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { getCheckableDataAttributes } from '../../utils/state-attrs.js';
	import { Button } from '../button/index.js';
	import { HiddenInput } from '../hidden-input/index.js';

	import { getRadioGroupState, setRadioItemState } from './context.js';

	type ItemMouseEvent = Parameters<NonNullable<ItemProps['onclick']>>[0];
	type ItemKeyboardEvent = Parameters<NonNullable<ItemProps['onkeydown']>>[0];

	const group = getRadioGroupState();

	let {
		value,
		disabled: disabledProp = false,
		readOnly: readOnlyProp = false,
		required: requiredProp = false,
		id = undefined,
		inputRef = $bindable<HTMLInputElement | undefined>(undefined),
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ItemProps = $props();

	const disabled = $derived(disabledProp || group.disabled);
	const readOnly = $derived(readOnlyProp || group.readOnly);
	const required = $derived(requiredProp || group.required);
	const checked = $derived(group.checkedValue === value);

	/**
	 * Single tab stop: the checked item, else the first enabled one.
	 * Checked-but-disabled falls back to the first enabled item.
	 */
	const tabStop = $derived.by(() => {
		const order = group.entries.filter((item) => !item.disabled);
		if (order.length === 0) return -1;
		const stop = order.find((item) => item.value === group.checkedValue) ?? order[0];
		return stop?.value === value ? 0 : -1;
	});

	setRadioItemState({
		get checked() {
			return checked;
		},
		get disabled() {
			return disabled;
		},
		get required() {
			return required;
		},
		get readOnly() {
			return readOnly;
		}
	});

	/**
	 * Single registration for the item's lifetime. Getters keep the entry
	 * live (no re-registration, no effect loop) — deliberately `onMount`,
	 * not `$effect`: registry writes must never feed back into subscriptions.
	 */
	onMount(() => {
		group.register({
			value,
			get disabled() {
				return disabled;
			},
			get element() {
				return ref;
			}
		});
		return () => group.unregister(value);
	});

	const dataAttrs = $derived(getCheckableDataAttributes({ checked, disabled, readOnly, required }));

	function activateItem(): void {
		if (readOnly) return;
		group.select(value);
	}

	function handleNativeChange(next: boolean): void {
		if (next && !readOnly) group.select(value);
	}

	function handleArrows(event: ItemKeyboardEvent): void {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Home':
			case 'End':
				event.preventDefault();
				if (event.currentTarget instanceof HTMLElement)
					group.move(value, event.key, event.currentTarget);
				break;
		}
	}

	function suppressEnter(event: ItemKeyboardEvent): void {
		// A radio activates with Space only, never Enter.
		if (event.key !== 'Enter') return;
		event.preventDefault();
	}
</script>

<Button
	{...rest}
	element="span"
	role="radio"
	{disabled}
	bind:ref
	tabindex={tabStop}
	aria-checked={checked}
	{...dataAttrs}
	onkeydown={composeHandlers(rest.onkeydown, handleArrows, suppressEnter)}
	onclick={composeHandlers(rest.onclick, activateItem)}
>
	{@render children?.()}
</Button>
<HiddenInput
	type="radio"
	{checked}
	{disabled}
	{readOnly}
	name={group.name}
	{value}
	form={group.form}
	{required}
	{id}
	bind:inputRef
	onNativeChange={handleNativeChange}
/>
