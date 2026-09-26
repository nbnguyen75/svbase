<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		/** Arrow-key axis for moving between menus. @default 'horizontal' */
		orientation?: 'horizontal' | 'vertical';
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { optionalContext } from '../../utils/context.js';
	import { nextRovingTarget } from '../../utils/roving.js';
	import { getDirectionState } from '../direction/context.js';

	import { type MenubarTriggerHandle, type MenubarMenuHandle, setMenubarState } from './context.js';

	// Captured at init: component context is unavailable in event handlers.
	const direction = optionalContext(getDirectionState);

	let {
		orientation = 'horizontal',
		disabled = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	let openMenuValue = $state<string | undefined>(undefined);
	let menus = $state<Array<MenubarMenuHandle>>([]);
	let triggers = $state<Array<MenubarTriggerHandle>>([]);

	function entries() {
		return triggers.map((trigger) => {
			const menu = menus.find((candidate) => candidate.value === trigger.menuValue);
			return {
				value: trigger.menuValue,
				disabled: menu?.disabled !== false,
				element: trigger.element
			};
		});
	}

	function allowedKey(key: string): boolean {
		if (key === 'Home' || key === 'End') return true;
		if (orientation === 'horizontal') return key === 'ArrowLeft' || key === 'ArrowRight';
		return key === 'ArrowUp' || key === 'ArrowDown';
	}

	function requestOpen(value: string): void {
		const menu = menus.find((candidate) => candidate.value === value);
		if (!menu || menu.disabled || disabled) return;
		for (const candidate of menus) {
			if (candidate.value !== value) candidate.closeMenu();
		}
		openMenuValue = value;
		menu.openMenu();
	}

	setMenubarState({
		get orientation() {
			return orientation;
		},
		get disabled() {
			return disabled;
		},
		get openMenuValue() {
			return openMenuValue;
		},
		registerMenu(menu: MenubarMenuHandle) {
			menus = [...menus.filter((candidate) => candidate.value !== menu.value), menu];
		},
		unregisterMenu(value: string) {
			menus = menus.filter((candidate) => candidate.value !== value);
			if (openMenuValue === value) openMenuValue = undefined;
		},
		registerTrigger(trigger: MenubarTriggerHandle) {
			triggers = [
				...triggers.filter((candidate) => candidate.menuValue !== trigger.menuValue),
				trigger
			];
		},
		unregisterTrigger(menuValue: string) {
			triggers = triggers.filter((candidate) => candidate.menuValue !== menuValue);
		},
		requestOpen,
		notifyClosed(value: string) {
			if (openMenuValue === value) openMenuValue = undefined;
		},
		moveFocus(fromMenuValue: string, key: string, source: HTMLElement) {
			if (disabled || !allowedKey(key)) return;

			const rtl =
				direction?.direction === 'rtl' ||
				source.closest('[dir="rtl"]') !== null ||
				document.dir === 'rtl';
			const next = nextRovingTarget(entries(), fromMenuValue, key, rtl);
			next?.element?.focus();
			// Moving focus across triggers while a menu is open switches menus.
			if (openMenuValue !== undefined && next && next.value !== openMenuValue) {
				requestOpen(next.value);
			}
		},
		focusMenuTrigger(value: string) {
			triggers.find((trigger) => trigger.menuValue === value)?.element?.focus();
		}
	});
</script>

<div
	{...rest}
	bind:this={ref}
	role="menubar"
	aria-orientation={orientation}
	data-disabled={disabled ? '' : undefined}
>
	{@render children?.()}
</div>
