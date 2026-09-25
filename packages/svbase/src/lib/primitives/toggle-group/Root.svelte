<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next value whenever selection changes. */
		onValueChange?: ((value: string | Array<string> | null) => void) | undefined;
		/** Initial value for uncontrolled usage. @default null (single) / [] (multiple) */
		defaultValue?: string | Array<string> | null;
		/** Arrow-key axis. @default 'horizontal' */
		orientation?: 'horizontal' | 'vertical';
		/** Selected value(s). Single string, array, or null when empty (controlled). */
		value?: string | Array<string> | null;
		/** Whether several items may be pressed at once. @default false */
		multiple?: boolean;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Form field name (hidden inputs sync the value, one per selected value). */
		name?: string;
	}
</script>

<script lang="ts">
	import { nextRovingTarget } from '../../utils/roving.js';

	import { type ToggleGroupItemEntry, setToggleGroupState } from './context.js';

	let {
		defaultValue = undefined,
		value = $bindable(defaultValue ?? null),
		multiple = false,
		orientation = 'horizontal',
		disabled = false,
		name = undefined,
		onValueChange = undefined,
		children
	}: RootProps = $props();

	let entries = $state<Array<ToggleGroupItemEntry>>([]);

	function asArray(current: string | Array<string> | null): Array<string> {
		if (current === null) return [];
		return Array.isArray(current) ? current : [current];
	}

	function isPressed(itemValue: string): boolean {
		return asArray(value).includes(itemValue);
	}

	function toggle(itemValue: string, pressed: boolean): void {
		if (disabled) return;
		const next = multiple
			? pressed
				? [...asArray(value), itemValue]
				: asArray(value).filter((entry) => entry !== itemValue)
			: pressed
				? itemValue
				: null;
		onValueChange?.(next);
		value = next;
	}

	function moveFocus(fromValue: string, key: string, source: HTMLElement): void {
		if (disabled) return;
		if (orientation === 'horizontal' && (key === 'ArrowUp' || key === 'ArrowDown')) return;
		if (orientation === 'vertical' && (key === 'ArrowLeft' || key === 'ArrowRight')) return;
		const rtl = source.closest('[dir="rtl"]') !== null || document.dir === 'rtl';
		const next = nextRovingTarget(entries, fromValue, key, rtl);
		next?.element?.focus();
	}

	setToggleGroupState({
		get multiple() {
			return multiple;
		},
		get value() {
			return value;
		},
		get disabled() {
			return disabled;
		},
		get orientation() {
			return orientation;
		},
		get entries() {
			return entries;
		},
		isPressed,
		toggle,
		register(entry: ToggleGroupItemEntry) {
			entries = [...entries.filter((item) => item.value !== entry.value), entry];
		},
		unregister(itemValue: string) {
			entries = entries.filter((item) => item.value !== itemValue);
		},
		moveFocus
	});
</script>

<div role="group" data-disabled={disabled ? '' : undefined}>
	{@render children?.()}
</div>
{#if name !== undefined}
	{#each asArray(value) as selectedValue (selectedValue)}
		<input type="hidden" {name} value={selectedValue} disabled={disabled ? true : undefined} />
	{/each}
{/if}
