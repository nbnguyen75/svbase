<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the content element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
		/** Overrides the generated id (trigger links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { escapeKey } from '../../actions/index.js';
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { nextRovingTarget } from '../../utils/roving.js';

	import { setMenuContentState, type MenuItemEntry, getMenuRootState } from './context.js';

	type ContentKeyboardEvent = Parameters<NonNullable<ContentProps['onkeydown']>>[0];

	const root = getMenuRootState();

	let {
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ContentProps = $props();

	let entries = $state<Array<MenuItemEntry>>([]);
	let highlightedId = $state<string | undefined>(undefined);
	let searchBuffer = '';
	let searchTimer: number | undefined = undefined;

	onMount(() => {
		const effective = id ?? root.defaultContentId;
		root.registerContentId(effective);
		if (root.consumeInitialFocus?.() === true) {
			const first = entries.filter((item) => !item.disabled)[0];
			if (first) {
				setHighlighted(first.value);
				focusEntry(first);
			}
		}
		return () => root.registerContentId(undefined);
	});

	onDestroy(() => {
		window.clearTimeout(searchTimer);
	});

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		root.registerContent(ref);
		return () => root.registerContent(undefined);
	});

	function register(entry: MenuItemEntry): void {
		entries = [...entries.filter((item) => item.value !== entry.value), entry];
	}

	function unregister(itemId: string): void {
		entries = entries.filter((item) => item.value !== itemId);
		if (highlightedId === itemId) highlightedId = undefined;
	}

	function setHighlighted(itemId: string | undefined): void {
		highlightedId = itemId;
	}

	function currentId(): string {
		const focused = document.activeElement;
		const current = entries.find((item) => item.element === focused);
		return current?.value ?? highlightedId ?? '';
	}

	function focusEntry(entry: { element: HTMLElement | undefined } | undefined): void {
		entry?.element?.focus();
	}

	function moveHighlight(key: string): void {
		const source = document.activeElement;
		const rtl =
			(source instanceof HTMLElement && source.closest('[dir="rtl"]') !== null) ||
			document.dir === 'rtl';
		const next = nextRovingTarget(entries, currentId(), key, rtl);
		if (!next) return;
		setHighlighted(next.value);
		focusEntry(next);
	}

	function typeahead(char: string): void {
		searchBuffer += char.toLowerCase();
		window.clearTimeout(searchTimer);
		searchTimer = window.setTimeout(() => {
			searchBuffer = '';
		}, 1000);
		const enabled = entries.filter((item) => !item.disabled);
		if (enabled.length === 0) return;
		const start = enabled.findIndex((item) => item.value === currentId());
		for (let step = 1; step <= enabled.length; step += 1) {
			const entry = enabled[(start + step + enabled.length) % enabled.length];
			if (entry?.label.toLowerCase().startsWith(searchBuffer) === true) {
				setHighlighted(entry.value);
				focusEntry(entry);
				return;
			}
		}
	}

	function handleKeys(event: ContentKeyboardEvent): void {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Home':
			case 'End':
				event.preventDefault();
				moveHighlight(event.key);
				return;
		}
		if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey)
			typeahead(event.key);
	}

	function handleFocusOut(event: FocusEvent): void {
		// Tab-away and programmatic blur dismiss uniformly — focus has
		// already moved, so nothing is stolen. Moves into any menu
		// (e.g. an open submenu) keep ancestors open.
		const next = event.relatedTarget;
		if (
			next instanceof Element &&
			(ref?.contains(next) === true || next.closest('[role="menu"]') !== null)
		)
			return;
		root.dismiss();
	}

	function handleContentLeave(event: MouseEvent): void {
		// Submenus only: leaving toward the trigger keeps the submenu open.
		if (!root.nested) return;
		const next = event.relatedTarget;
		if (next instanceof Element && root.triggerElement?.contains(next) === true) return;
		root.dismiss();
	}

	setMenuContentState({
		get highlightedId() {
			return highlightedId;
		},
		get entries() {
			return entries;
		},
		register,
		unregister,
		setHighlighted
	});

	const escapeCapture = root.nested;
	function handleEscape(event: KeyboardEvent): void {
		if (escapeCapture) event.stopPropagation();
		root.closeMenu();
		root.focusTrigger();
	}
</script>

{#if root.open}
	<div
		{...rest}
		bind:this={ref}
		id={id ?? root.defaultContentId}
		role="menu"
		data-state="open"
		data-disabled={root.disabled ? '' : undefined}
		data-placement={root.position.placement}
		hidden={!root.position.positioned}
		{@attach root.position.floating}
		{@attach escapeKey(handleEscape, { capture: escapeCapture })}
		onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
		onfocusout={composeHandlers(rest.onfocusout, handleFocusOut)}
		onmouseleave={composeHandlers(rest.onmouseleave, handleContentLeave)}
	>
		{@render children?.()}
	</div>
{/if}
