<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
		/** Arrow-key axis. @default 'horizontal' */
		orientation?: 'horizontal' | 'vertical';
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { nextRovingTarget } from '../../utils/roving.js';

	import { setToolbarState, type ToolbarItemEntry } from './context.js';

	let {
		orientation = 'horizontal',
		disabled = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	let entries = $state<Array<ToolbarItemEntry>>([]);
	let focusedElement = $state<HTMLElement | undefined>(undefined);

	type ToolbarFocusEvent = FocusEvent & { currentTarget: EventTarget & HTMLElement };

	function focusableEntries(): Array<ToolbarItemEntry> {
		return entries.filter((item) => !item.disabled || item.focusable);
	}

	function allowedKey(key: string): boolean {
		if (key === 'Home' || key === 'End') return true;
		if (orientation === 'horizontal') return key === 'ArrowLeft' || key === 'ArrowRight';
		return key === 'ArrowUp' || key === 'ArrowDown';
	}

	function handleFocusIn(event: ToolbarFocusEvent): void {
		if (event.target instanceof HTMLElement && ref?.contains(event.target) === true) {
			focusedElement = event.target;
		}
	}

	function handleFocusOut(event: ToolbarFocusEvent): void {
		const next = event.relatedTarget;
		if (next instanceof HTMLElement && ref?.contains(next) === true) return;
		focusedElement = undefined;
	}

	setToolbarState({
		get orientation() {
			return orientation;
		},
		get disabled() {
			return disabled;
		},
		register(entry: ToolbarItemEntry) {
			entries = [...entries.filter((item) => item.element !== entry.element), entry];
		},
		unregister(element: HTMLElement | undefined) {
			entries = entries.filter((item) => item.element !== element);
			if (focusedElement === element) focusedElement = undefined;
		},
		moveFocus(fromElement: HTMLElement, key: string) {
			if (disabled || !allowedKey(key)) return;
			const rtl = fromElement.closest('[dir="rtl"]') !== null || document.dir === 'rtl';
			// Roving skips disabled items entirely (focusable-when-disabled
			// buttons still Tab through their own tabindex handling).
			const pool = focusableEntries().filter((item) => !item.disabled);
			const fromValue = pool.findIndex((item) => item.element === fromElement);
			const candidates = pool.map((item, index) => ({
				value: String(index),
				disabled: false,
				element: item.element
			}));
			const next = nextRovingTarget(
				candidates,
				fromValue === -1 ? '' : String(fromValue),
				key,
				rtl
			);
			next?.element?.focus();
		},
		isTabStop(element: HTMLElement | undefined) {
			if (focusedElement !== undefined) return element === focusedElement;
			return focusableEntries()[0]?.element === element;
		}
	});
</script>

<div
	{...rest}
	bind:this={ref}
	role="toolbar"
	aria-orientation={orientation}
	data-disabled={disabled ? '' : undefined}
	onfocusin={composeHandlers<ToolbarFocusEvent>(rest.onfocusin, handleFocusIn)}
	onfocusout={composeHandlers<ToolbarFocusEvent>(rest.onfocusout, handleFocusOut)}
>
	{@render children?.()}
</div>
