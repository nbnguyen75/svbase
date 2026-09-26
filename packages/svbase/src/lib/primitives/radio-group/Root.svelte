<script lang="ts" module>
	import type { RadioOrientation } from './context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLDivElement> {
		/** Fired with the next value whenever selection changes. */
		onValueChange?: ((value: string) => void) | undefined;
		/** Reading direction for arrow keys. @default 'horizontal' */
		orientation?: RadioOrientation | undefined;
		/** Initially selected value for uncontrolled usage. */
		defaultValue?: string | undefined;
		/** Delegated access to the group element. */
		ref?: HTMLDivElement | undefined;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean | undefined;
		/** Whether selection is locked (focus still moves). @default false */
		readOnly?: boolean | undefined;
		/** Whether a selection is required for form submission. @default false */
		required?: boolean | undefined;
		/** Selected item value (controlled). */
		value?: string | undefined;
		/** Form field name. Omit to exclude from submission. */
		name?: string | undefined;
		form?: string | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { optionalContext } from '../../utils/context.js';
	import { nextRovingTarget } from '../../utils/roving.js';

	import { type RadioItemEntry, setRadioGroupState } from './context.js';
	import { getDirectionState } from '../direction/context.js';

	// Captured at init: component context is unavailable in event handlers.
	const direction = optionalContext(getDirectionState);

	let {
		defaultValue = undefined,
		value = $bindable(defaultValue),
		disabled = false,
		readOnly = false,
		required = false,
		name = undefined,
		form = undefined,
		orientation = 'horizontal',
		onValueChange = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	let items = $state<Array<RadioItemEntry>>([]);

	function commit(next: string): void {
		onValueChange?.(next);
		value = next;
	}

	function select(itemValue: string): void {
		if (disabled || readOnly) return;
		commit(itemValue);
	}

	function register(entry: RadioItemEntry): void {
		items = [...items.filter((item) => item.value !== entry.value), entry];
	}

	function unregister(itemValue: string): void {
		items = items.filter((item) => item.value !== itemValue);
	}

	/**
	 * Roving focus with selection following it (WAI-APG radio pattern).
	 * Target resolution is shared with accordion via `nextRovingTarget`.
	 */
	function move(fromValue: string, key: string, source: HTMLElement): void {
		const rtl =
			direction?.direction === 'rtl' ||
			source.closest('[dir="rtl"]') !== null ||
			document.dir === 'rtl';
		const next = nextRovingTarget(items, fromValue, key, rtl);
		if (!next) return;
		next.element?.focus();
		if (!readOnly) commit(next.value);
	}

	setRadioGroupState({
		get checkedValue() {
			return value;
		},
		get disabled() {
			return disabled;
		},
		get required() {
			return required;
		},
		get readOnly() {
			return readOnly;
		},
		get orientation() {
			return orientation;
		},
		get name() {
			return name;
		},
		get form() {
			return form;
		},
		get entries() {
			return items;
		},
		select,
		register,
		unregister,
		move
	});
</script>

<div
	{...rest}
	bind:this={ref}
	role="radiogroup"
	aria-orientation={orientation}
	aria-required={required ? 'true' : rest['aria-required']}
	aria-disabled={disabled ? 'true' : rest['aria-disabled']}
	data-disabled={disabled ? '' : undefined}
	data-orientation={orientation}
>
	{@render children?.()}
</div>
