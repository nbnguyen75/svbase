<script lang="ts" module>
	import type { DialogRole } from './context.js';
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next state whenever the dialog opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/**
		 * Clicking the overlay does not close the dialog (Escape still does).
		 * Always true for alert dialogs.
		 * @default false
		 */
		disablePointerDismissal?: boolean;
		/** Initially open for uncontrolled usage. @default false */
		defaultOpen?: boolean;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Accessibility role. Alert dialogs force `alertdialog`. @default 'dialog' */
		role?: DialogRole;
		/** Whether the dialog is open (controlled). */
		open?: boolean;
	}

	// Focusable selectors for the trap, in DOM order.
	const TABBABLE =
		'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';

	import { setDialogState } from './context.js';

	let {
		defaultOpen = false,
		open = $bindable(defaultOpen),
		disabled = false,
		disablePointerDismissal = false,
		role = 'dialog',
		onOpenChange = undefined,
		children
	}: RootProps = $props();

	// Plain fields (not $state): written on mount, read from event
	// handlers and effect cleanup — never tracked, so no update loops.
	let triggerEl: HTMLElement | undefined = undefined;
	let popupEl: HTMLElement | undefined = undefined;

	let titleId = $state<string | undefined>(undefined);
	let descriptionId = $state<string | undefined>(undefined);
	let contentId = $state<string | undefined>(undefined);

	const defaultTitleId = createId('dialog-title');
	const defaultDescriptionId = createId('dialog-description');
	const defaultContentId = createId('dialog-content');

	function commit(next: boolean): void {
		onOpenChange?.(next);
		open = next;
	}

	function openDialog(): void {
		if (!disabled) commit(true);
	}

	function closeDialog(): void {
		commit(false);
	}

	function toggleDialog(): void {
		if (!disabled) commit(!open);
	}

	function tabbables(): Array<HTMLElement> {
		if (!popupEl) return [];
		const nodes = popupEl.querySelectorAll(TABBABLE);
		return [...nodes]
			.filter((node): node is HTMLElement => node instanceof HTMLElement)
			.filter((node) => node.getClientRects().length > 0);
	}

	/**
	 * The dialog behavior controller: initial focus, Tab trap, scroll lock,
	 * Escape dismissal, and focus return. Runs only while open.
	 */
	$effect(() => {
		if (!open || !popupEl) return;
		const popup = popupEl;
		const previouslyFocused =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;

		const first = tabbables()[0];
		if (first) first.focus();
		else popup.focus();

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		function onKeydown(event: KeyboardEvent): void {
			if (event.key === 'Escape') {
				event.preventDefault();
				closeDialog();
				return;
			}
			if (event.key !== 'Tab') return;
			const items = tabbables();
			if (items.length === 0) {
				event.preventDefault();
				popup.focus();
				return;
			}
			const firstItem = items[0];
			const lastItem = items[items.length - 1];
			if (!firstItem || !lastItem) return;
			if (event.shiftKey && document.activeElement === firstItem) {
				event.preventDefault();
				lastItem.focus();
			} else if (!event.shiftKey && document.activeElement === lastItem) {
				event.preventDefault();
				firstItem.focus();
			}
		}

		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('keydown', onKeydown);
			document.body.style.overflow = previousOverflow;
			const connected =
				triggerEl?.isConnected === true
					? triggerEl
					: previouslyFocused?.isConnected === true
						? previouslyFocused
						: null;
			connected?.focus();
		};
	});

	setDialogState({
		get open() {
			return open;
		},
		get disabled() {
			return disabled;
		},
		get disablePointerDismissal() {
			return disablePointerDismissal;
		},
		get role() {
			return role;
		},
		defaultTitleId,
		defaultDescriptionId,
		defaultContentId,
		get titleId() {
			return titleId;
		},
		get descriptionId() {
			return descriptionId;
		},
		get contentId() {
			return contentId;
		},
		openDialog,
		closeDialog,
		toggleDialog,
		registerTrigger(element: HTMLElement | undefined) {
			triggerEl = element;
		},
		registerContent(element: HTMLElement | undefined) {
			popupEl = element;
		},
		registerTitleId(id: string | undefined) {
			titleId = id;
		},
		registerDescriptionId(id: string | undefined) {
			descriptionId = id;
		},
		registerContentId(id: string | undefined) {
			contentId = id;
		}
	});
</script>

<!-- Root renders no element of its own (Base UI parity) — children only. -->
{@render children?.()}
