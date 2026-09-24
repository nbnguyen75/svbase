import { createPrimitiveContext } from '../../utils/context.js';
import type { FloatingPosition } from '../../utils/position.svelte.js';

export interface MenuItemEntry {
	value: string;
	disabled: boolean;
	element: HTMLElement | undefined;
	label: string;
	select(): void;
}

export interface MenuRootState {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly nested: boolean;
	readonly defaultContentId: string;
	readonly contentId: string | undefined;
	readonly position: FloatingPosition;
	openMenu(): void;
	/** Closes and returns focus to the trigger. */
	closeMenu(): void;
	/** Closes without moving focus (outside press, Tab-away). */
	dismiss(): void;
	toggleMenu(): void;
	focusTrigger(): void;
	/**
	 * Submenu-only: focus the first item when content mounts next.
	 * Absent on menu roots.
	 */
	requestInitialFocus?(): void;
	/** Submenu-only: consume a pending initial-focus request. */
	consumeInitialFocus?(): boolean;
	/** Live element reads for leave-guards (non-reactive use only). */
	readonly triggerElement: HTMLElement | undefined;
	readonly contentElement: HTMLElement | undefined;
	registerTrigger(element: HTMLElement | undefined): void;
	registerContent(element: HTMLElement | undefined): void;
	registerContentId(id: string | undefined): void;
}

export interface MenuContentState {
	readonly highlightedId: string | undefined;
	readonly entries: Array<MenuItemEntry>;
	register(entry: MenuItemEntry): void;
	unregister(id: string): void;
	setHighlighted(id: string | undefined): void;
}

export interface MenuItemState {
	readonly checked: boolean;
	readonly disabled: boolean;
}

export const [getMenuRootState, setMenuRootState] = createPrimitiveContext<MenuRootState>('Menu');
export const [getMenuContentState, setMenuContentState] =
	createPrimitiveContext<MenuContentState>('MenuContent');
export const [getMenuItemState, setMenuItemState] =
	createPrimitiveContext<MenuItemState>('MenuItem');
