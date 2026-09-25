<script lang="ts" module>
	import type { Placement } from '../../utils/position.svelte.js';
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Custom matcher for filtering labels. Defaults to case-insensitive substring. */
		filterItems?: ((label: string, filter: string) => boolean) | undefined;
		/** Fired with the next value whenever selection changes. */
		onValueChange?: ((value: string | null) => void) | undefined;
		/** Fired with the next filter text whenever it changes. */
		onFilterChange?: ((filter: string) => void) | undefined;
		/** Fired with the next state whenever the list opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Initially selected value for uncontrolled usage. @default null */
		defaultValue?: string | null;
		/** Highlight the first match while filtering. @default true */
		autoHighlight?: boolean;
		/** Initial filter text for uncontrolled usage. @default '' */
		defaultFilter?: string;
		/** Selected item value, or `null` when empty (controlled). */
		value?: string | null;
		/** Initially open for uncontrolled usage. @default false */
		defaultOpen?: boolean;
		/** Preferred placement; flips on collision. @default 'bottom-start' */
		placement?: Placement;
		/**
		 * Autocomplete mode: Enter commits the typed text itself as the value
		 * instead of requiring an item match; blur keeps the text.
		 * @default false
		 */
		freeInput?: boolean;
		/** Gap between input and content, in pixels. @default 0 */
		sideOffset?: number;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Filter text (controlled). */
		filter?: string;
		/** Whether the list is open (controlled). */
		open?: boolean;
		/** Form field name (hidden input syncs the value). */
		name?: string;
	}
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';
	import { trackOutsidePress } from '../../utils/outside.js';
	import { FloatingPosition } from '../../utils/position.svelte.js';
	import { nextRovingTarget } from '../../utils/roving.js';

	import { type ComboboxItemEntry, setComboboxRootState } from './context.js';

	let {
		defaultValue = null,
		value = $bindable(defaultValue),
		defaultOpen = false,
		open = $bindable(defaultOpen),
		defaultFilter = '',
		filter = $bindable(defaultFilter),
		filterItems = undefined,
		autoHighlight = true,
		freeInput = false,
		disabled = false,
		placement = 'bottom-start',
		sideOffset = 0,
		name = undefined,
		onValueChange = undefined,
		onOpenChange = undefined,
		onFilterChange = undefined,
		children
	}: RootProps = $props();

	// Plain fields: written imperatively, read from event handlers —
	// never tracked, so no update loops.
	let inputEl: HTMLInputElement | undefined = undefined;
	let popupEl: HTMLElement | undefined = undefined;

	const position = new FloatingPosition();

	const defaultContentId = createId('combobox-list');

	const matches = $derived(
		filterItems ??
			((label: string, query: string): boolean => label.toLowerCase().includes(query.toLowerCase()))
	);

	let contentId = $state<string | undefined>(undefined);
	let entries = $state<Array<ComboboxItemEntry>>([]);
	let highlightedValue = $state<string | undefined>(undefined);

	const visibleEntries = $derived(entries.filter((item) => matches(item.label, filter)));
	const visibleCount = $derived(visibleEntries.length);

	$effect(() => {
		position.update({ placement, offset: sideOffset });
	});

	$effect(() => {
		if (!open) return;
		return trackOutsidePress(
			() => [inputEl, popupEl],
			() => setOpen(false)
		);
	});

	// Auto-highlight the first visible match while filtering.
	$effect(() => {
		if (!open || !autoHighlight) return;
		const first = visibleEntries.find((item) => !item.disabled);
		if (first && highlightedValue !== first.value) highlightedValue = first.value;
		if (!first && highlightedValue !== undefined) highlightedValue = undefined;
	});

	function setOpen(next: boolean): void {
		onOpenChange?.(next);
		open = next;
	}

	function setFilterText(text: string): void {
		onFilterChange?.(text);
		filter = text;
	}

	function labelFor(target: string | null): string {
		if (target === null) return '';
		return entries.find((item) => item.value === target)?.label ?? target;
	}

	function select(next: string | null): void {
		onValueChange?.(next);
		value = next;
		setFilterText(labelFor(next));
	}

	function openMenu(): void {
		if (disabled) return;
		setOpen(true);
	}

	function closeMenu(): void {
		setOpen(false);
		focusInput();
	}

	function dismiss(): void {
		setOpen(false);
	}

	function toggleMenu(): void {
		if (!disabled) setOpen(!open);
	}

	function focusInput(): void {
		inputEl?.focus();
	}

	function commitFreeText(): void {
		const text = filter;
		if (text === '') {
			select(null);
		} else {
			onValueChange?.(text);
			value = text;
		}
		setOpen(false);
		focusInput();
	}

	function revertText(): void {
		setFilterText(labelFor(value));
	}

	function setHighlighted(itemValue: string | undefined): void {
		highlightedValue = itemValue;
	}

	function register(entry: ComboboxItemEntry): void {
		entries = [...entries.filter((item) => item.value !== entry.value), entry];
	}

	function unregister(itemValue: string): void {
		entries = entries.filter((item) => item.value !== itemValue);
		if (highlightedValue === itemValue) highlightedValue = undefined;
	}

	function moveHighlight(fromValue: string, key: string, source: HTMLElement): void {
		if (disabled) return;
		const rtl = source.closest('[dir="rtl"]') !== null || document.dir === 'rtl';
		// Focus stays in the textbox (aria-activedescendant pattern) — only the
		// highlight moves, so the user can keep typing.
		const candidates = visibleEntries.filter((item) => !item.disabled);
		const next = nextRovingTarget(candidates, fromValue, key, rtl);
		if (!next) return;
		setHighlighted(next.value);
		next.element?.scrollIntoView({ block: 'nearest' });
	}

	setComboboxRootState({
		get open() {
			return open;
		},
		get disabled() {
			return disabled;
		},
		get value() {
			return value;
		},
		get filter() {
			return filter;
		},
		get highlightedValue() {
			return highlightedValue;
		},
		get entries() {
			return entries;
		},
		get visibleCount() {
			return visibleCount;
		},
		defaultContentId,
		get contentId() {
			return contentId;
		},
		position,
		get freeInput() {
			return freeInput;
		},
		openMenu,
		closeMenu,
		dismiss,
		toggleMenu,
		select,
		commitFreeText,
		revertText,
		setFilter: setFilterText,
		setHighlighted,
		register,
		unregister,
		moveHighlight,
		registerContentId(id: string | undefined) {
			contentId = id;
		},
		registerInput(element: HTMLInputElement | undefined) {
			inputEl = element;
		},
		registerContent(element: HTMLElement | undefined) {
			popupEl = element;
		},
		focusInput,
		labelFor,
		matchesFilter(label: string): boolean {
			return matches(label, filter);
		}
	});
</script>

<!-- Root renders no element of its own — children only. -->
{@render children?.()}
{#if name !== undefined}
	<input type="hidden" {name} value={value ?? ''} disabled={disabled ? true : undefined} />
{/if}
