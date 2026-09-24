<script lang="ts" module>
	import type { TabsActivation } from './context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ListProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the list element. */
		ref?: HTMLDivElement | undefined;
		/**
		 * Whether focus moves selection (`automatic`) or only focus
		 * (`manual`, selection on Enter/Space/click). @default 'manual'
		 */
		activation?: TabsActivation;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { nextRovingTarget } from '../../utils/roving.js';

	import { type TabsTriggerEntry, getTabsRootState, setTabsListState } from './context.js';

	type ListKeyboardEvent = Parameters<NonNullable<ListProps['onkeydown']>>[0];

	const root = getTabsRootState();

	let {
		activation = 'manual',
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ListProps = $props();

	let entries = $state<Array<TabsTriggerEntry>>([]);
	let focusedValue = $state<string | undefined>(undefined);

	$effect(() => {
		if (root.value === undefined) {
			const first = entries.filter((item) => !item.disabled)[0];
			if (first) root.select(first.value);
		}
	});

	function register(entry: TabsTriggerEntry): void {
		entries = [...entries.filter((item) => item.value !== entry.value), entry];
	}

	function unregister(itemValue: string): void {
		entries = entries.filter((item) => item.value !== itemValue);
		if (focusedValue === itemValue) focusedValue = undefined;
	}

	function setFocusedValue(itemValue: string | undefined): void {
		focusedValue = itemValue;
	}

	function moveFocus(fromValue: string, key: string, source: HTMLElement): void {
		if (root.disabled) return;
		const horizontal = root.orientation !== 'vertical';
		const valid =
			horizontal === true
				? ['ArrowLeft', 'ArrowRight', 'Home', 'End']
				: ['ArrowUp', 'ArrowDown', 'Home', 'End'];
		if (!valid.includes(key)) return;
		const rtl = source.closest('[dir="rtl"]') !== null || document.dir === 'rtl';
		const next = nextRovingTarget(entries, fromValue, key, rtl);
		if (!next) return;
		setFocusedValue(next.value);
		next.element?.focus();
		if (activation === 'automatic' && next.value !== root.value) root.select(next.value);
	}

	function currentValue(): string {
		const focused = document.activeElement;
		const current = entries.find((item) => item.element === focused);
		return current?.value ?? focusedValue ?? '';
	}

	function handleKeys(event: ListKeyboardEvent): void {
		moveFocus(currentValue(), event.key, event.currentTarget as HTMLElement);
	}

	setTabsListState({
		get activation() {
			return activation;
		},
		get focusedValue() {
			return focusedValue;
		},
		get entries() {
			return entries;
		},
		setFocusedValue,
		register,
		unregister,
		moveFocus
	});
</script>

<div
	{...rest}
	bind:this={ref}
	role="tablist"
	aria-orientation={root.orientation}
	data-orientation={root.orientation}
	data-disabled={root.disabled ? '' : undefined}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
>
	{@render children?.()}
</div>
