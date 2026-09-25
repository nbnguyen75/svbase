<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next value whenever selection changes. */
		onValueChange?: ((value: Array<string>) => void) | undefined;
		/** Initially selected values for uncontrolled usage. @default [] */
		defaultValue?: Array<string>;
		/** Selected values (controlled). */
		value?: Array<string>;
		/** Every selectable value; drives the parent checkbox state. */
		allValues: Array<string>;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Form field name (one hidden input per selected value). */
		name?: string;
	}
</script>

<script lang="ts">
	import { setCheckboxGroupState, type CheckboxGroupParentState } from './context.js';

	let {
		defaultValue = [],
		value = $bindable(defaultValue),
		allValues,
		disabled = false,
		name = undefined,
		onValueChange = undefined,
		children
	}: RootProps = $props();

	const parentState = $derived.by<CheckboxGroupParentState>(() => {
		const selected = allValues.filter((entry) => value.includes(entry));
		if (selected.length === 0) return 'unchecked';
		if (selected.length === allValues.length && allValues.length > 0) return 'checked';
		return 'indeterminate';
	});

	function toggle(itemValue: string, checked: boolean): void {
		if (disabled) return;
		const next = checked
			? [...value.filter((entry) => entry !== itemValue), itemValue]
			: value.filter((entry) => entry !== itemValue);
		onValueChange?.(next);
		value = next;
	}

	function toggleAll(checked: boolean): void {
		if (disabled) return;
		const next = checked ? [...allValues] : [];
		onValueChange?.(next);
		value = next;
	}

	setCheckboxGroupState({
		get value() {
			return value;
		},
		get allValues() {
			return allValues;
		},
		get disabled() {
			return disabled;
		},
		get parentState() {
			return parentState;
		},
		isChecked(itemValue: string) {
			return value.includes(itemValue);
		},
		toggle,
		toggleAll
	});
</script>

<div role="group" data-disabled={disabled ? '' : undefined}>
	{@render children?.()}
</div>
{#if name !== undefined}
	{#each value as selectedValue (selectedValue)}
		<input type="hidden" {name} value={selectedValue} disabled={disabled ? true : undefined} />
	{/each}
{/if}
