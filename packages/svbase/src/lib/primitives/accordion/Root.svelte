<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLDivElement> {
		/** Fired with the next value whenever an item opens or closes. */
		onValueChange?: ((value: Array<string>) => void) | undefined;
		/** Delegated access to the root element. */
		ref?: HTMLDivElement | undefined;
		/** Initially open values for uncontrolled usage. @default [] */
		defaultValue?: Array<string>;
		/** Open item values (controlled). */
		value?: Array<string>;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		/** Whether several items may be open at once. @default false */
		multiple?: boolean;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { optionalContext } from '../../utils/context.js';
	import { nextRovingTarget } from '../../utils/roving.js';

	import { type AccordionTriggerEntry, setAccordionRootState } from './context.js';
	import { getDirectionState } from '../direction/context.js';

	// Captured at init: component context is unavailable in event handlers.
	const direction = optionalContext(getDirectionState);

	let {
		defaultValue = [],
		value = $bindable(defaultValue),
		disabled = false,
		multiple = false,
		onValueChange = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	let triggers = $state<Array<AccordionTriggerEntry>>([]);

	function commit(next: Array<string>): void {
		onValueChange?.(next);
		value = next;
	}

	function toggleValue(itemValue: string, nextOpen: boolean): void {
		if (disabled) return;
		if (!multiple) {
			commit(nextOpen ? [itemValue] : []);
			return;
		}
		if (nextOpen) {
			if (!value.includes(itemValue)) commit([...value, itemValue]);
			return;
		}
		commit(value.filter((item) => item !== itemValue));
	}

	function registerTrigger(entry: AccordionTriggerEntry): void {
		triggers = [...triggers.filter((item) => item.value !== entry.value), entry];
	}

	function unregisterTrigger(itemValue: string): void {
		triggers = triggers.filter((item) => item.value !== itemValue);
	}

	/**
	 * Arrow/Home/End keys move focus between triggers only — unlike radio,
	 * panels open on activation, never on focus (current APG guidance).
	 */
	function moveFocus(fromValue: string, key: string, source: HTMLElement): void {
		const rtl =
			direction?.direction === 'rtl' ||
			source.closest('[dir="rtl"]') !== null ||
			document.dir === 'rtl';
		nextRovingTarget(triggers, fromValue, key, rtl)?.element?.focus();
	}

	setAccordionRootState({
		get value() {
			return value;
		},
		get disabled() {
			return disabled;
		},
		get multiple() {
			return multiple;
		},
		toggleValue,
		registerTrigger,
		unregisterTrigger,
		moveFocus
	});
</script>

<div {...rest} bind:this={ref} data-disabled={disabled ? '' : undefined}>
	{@render children?.()}
</div>
