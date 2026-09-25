import { createPrimitiveContext } from '../../utils/context.js';

export interface MenubarMenuHandle {
	readonly value: string;
	readonly disabled: boolean;
	openMenu(): void;
	closeMenu(): void;
	focusTrigger(): void;
}

export interface MenubarTriggerHandle {
	readonly menuValue: string;
	readonly element: HTMLElement | undefined;
}

export interface MenubarState {
	readonly orientation: 'horizontal' | 'vertical';
	readonly disabled: boolean;
	readonly openMenuValue: string | undefined;
	registerMenu(menu: MenubarMenuHandle): void;
	unregisterMenu(value: string): void;
	registerTrigger(trigger: MenubarTriggerHandle): void;
	unregisterTrigger(menuValue: string): void;
	/** Opens one menu, closing any other. */
	requestOpen(value: string): void;
	/** Clears the open menu if it matches. */
	notifyClosed(value: string): void;
	moveFocus(fromMenuValue: string, key: string, source: HTMLElement): void;
	focusMenuTrigger(value: string): void;
}

export const [getMenubarState, setMenubarState] = createPrimitiveContext<MenubarState>('Menubar');
