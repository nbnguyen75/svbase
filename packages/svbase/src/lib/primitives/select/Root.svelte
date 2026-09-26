<script lang="ts" module>
	import type { Placement } from '../../utils/position.svelte.js';
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next value whenever selection changes. */
		onValueChange?: ((value: string | null) => void) | undefined;
		/** Fired with the next state whenever the list opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Initially selected value for uncontrolled usage. @default null */
		defaultValue?: string | null;
		/** Selected item value, or `null` when empty (controlled). */
		value?: string | null;
		/** Initially open for uncontrolled usage. @default false */
		defaultOpen?: boolean;
		/** Preferred placement; flips on collision. @default 'bottom-start' */
		placement?: Placement;
		/** Gap between trigger and content, in pixels. @default 0 */
		sideOffset?: number;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Whether the select is open (controlled). */
		open?: boolean;
		/** Form field name (hidden input syncs the value). */
		name?: string;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { optionalContext } from '../../utils/context.js';
	import { createId } from '../../utils/id.js';
	import { trackOutsidePress } from '../../utils/outside.js';
	import { FloatingPosition } from '../../utils/position.svelte.js';
	import { nextRovingTarget } from '../../utils/roving.js';
	import { getDirectionState } from '../direction/context.js';

	import { type SelectItemEntry, setSelectRootState } from './context.js';

	// Captured at init: component context is unavailable in event handlers.
	const direction = optionalContext(getDirectionState);

	let {
		defaultValue = null,
		value = $bindable(defaultValue),
		defaultOpen = false,
		open = $bindable(defaultOpen),
		disabled = false,
		placement = 'bottom-start',
		sideOffset = 0,
		name = undefined,
		onValueChange = undefined,
		onOpenChange = undefined,
		children
	}: RootProps = $props();

	// Plain fields: written on mount, read from event handlers —
	// never tracked, so no update loops.
	let triggerEl: HTMLElement | undefined = undefined;
	let popupEl: HTMLElement | undefined = undefined;
	let searchBuffer = '';
	let searchTimer: number | undefined = undefined;
	let focusListPending = false;

	const position = new FloatingPosition();

	const defaultContentId = createId('select-content');

	onDestroy(() => {
		window.clearTimeout(searchTimer);
	});

	let contentId = $state<string | undefined>(undefined);
	let entries = $state<Array<SelectItemEntry>>([]);
	let highlightedValue = $state<string | undefined>(undefined);

	$effect(() => {
		position.update({ placement, offset: sideOffset });
	});

	$effect(() => {
		if (!open) return;
		if (highlightedValue !== undefined) return;
		const enabled = entries.filter((item) => !item.disabled);
		const stop = enabled.find((item) => item.value === value) ?? enabled[0];
		if (stop) highlightedValue = stop.value;
	});

	$effect(() => {
		if (!open) return;
		return trackOutsidePress(
			() => [triggerEl, popupEl],
			() => setOpen(false),
			{ ignoreSelector: '[role="listbox"]' }
		);
	});

	function setOpen(next: boolean): void {
		onOpenChange?.(next);
		open = next;
	}

	function select(next: string | null): void {
		onValueChange?.(next);
		value = next;
	}

	function openMenu(): void {
		if (disabled) return;
		setOpen(true);
	}

	function closeMenu(): void {
		focusListPending = false;
		setOpen(false);
		const target = triggerEl?.isConnected === true ? triggerEl : null;
		target?.focus();
	}

	function dismiss(): void {
		focusListPending = false;
		setOpen(false);
	}

	function toggleMenu(): void {
		if (!disabled) setOpen(!open);
	}

	function focusTrigger(): void {
		triggerEl?.focus();
	}

	function setHighlighted(itemValue: string | undefined): void {
		highlightedValue = itemValue;
	}

	function register(entry: SelectItemEntry): void {
		entries = [...entries.filter((item) => item.value !== entry.value), entry];
	}

	function unregister(itemValue: string): void {
		entries = entries.filter((item) => item.value !== itemValue);
		if (highlightedValue === itemValue) highlightedValue = undefined;
	}

	function enabledEntries(): Array<SelectItemEntry> {
		return entries.filter((item) => !item.disabled);
	}

	function focusEntry(entry: SelectItemEntry | undefined): void {
		entry?.element?.focus();
		entry?.element?.scrollIntoView({ block: 'nearest' });
	}

	function moveHighlight(fromValue: string, key: string, source: HTMLElement): void {
		if (disabled) return;

		const rtl =
			direction?.direction === 'rtl' ||
			source.closest('[dir="rtl"]') !== null ||
			document.dir === 'rtl';
		const next = nextRovingTarget(entries, fromValue, key, rtl);
		if (!next) return;
		setHighlighted(next.value);
		focusEntry(next);
	}

	function matchEntry(): void {
		const match = findMatch(searchBuffer, currentValue());
		if (match === undefined) return;
		const entry = enabledEntries().find((item) => item.value === match);
		setHighlighted(match);
		focusEntry(entry);
	}

	function currentValue(): string {
		const focused = document.activeElement;
		const current = entries.find((item) => item.element === focused);
		return current?.value ?? highlightedValue ?? '';
	}

	function typeahead(char: string): void {
		searchBuffer += char.toLowerCase();
		window.clearTimeout(searchTimer);
		searchTimer = window.setTimeout(() => {
			searchBuffer = '';
		}, 1000);
		if (searchBuffer !== '') matchEntry();
	}

	function findMatch(buffer: string, fromValue: string): string | undefined {
		const enabled = enabledEntries();
		if (enabled.length === 0 || buffer === '') return undefined;
		const start = enabled.findIndex((item) => item.value === fromValue);
		for (let step = 1; step <= enabled.length; step += 1) {
			const entry = enabled[(start + step + enabled.length) % enabled.length];
			if (entry?.label.toLowerCase().startsWith(buffer) === true) return entry.value;
		}
		return undefined;
	}

	function consumeInitialFocus(): boolean {
		if (!focusListPending) return false;
		focusListPending = false;
		return true;
	}

	function requestInitialFocus(): void {
		focusListPending = true;
	}

	function focusHighlighted(): void {
		const enabled = enabledEntries();
		const stop =
			enabled.find((item) => item.value === highlightedValue) ??
			enabled.find((item) => item.value === value) ??
			enabled[0];
		if (stop) {
			setHighlighted(stop.value);
			focusEntry(stop);
		}
	}

	setSelectRootState({
		get open() {
			return open;
		},
		get disabled() {
			return disabled;
		},
		defaultContentId,
		get contentId() {
			return contentId;
		},
		position,
		get value() {
			return value;
		},
		get highlightedValue() {
			return highlightedValue;
		},
		get entries() {
			return entries;
		},
		openMenu,
		closeMenu,
		dismiss,
		toggleMenu,
		focusTrigger,
		select,
		setHighlighted,
		register,
		unregister,
		moveHighlight,
		typeahead,
		findMatch,
		registerContentId(id: string | undefined) {
			contentId = id;
		},
		registerTrigger(element: HTMLElement | undefined) {
			triggerEl = element;
		},
		registerContent(element: HTMLElement | undefined) {
			popupEl = element;
		},
		consumeInitialFocus,
		focusHighlighted,
		requestInitialFocus
	});
</script>

<!-- Root renders no element of its own — children only. -->
{@render children?.()}
{#if name !== undefined}
	<input type="hidden" {name} value={value ?? ''} disabled={disabled ? true : undefined} />
{/if}
