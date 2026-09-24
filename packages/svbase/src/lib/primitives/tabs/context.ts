import { createPrimitiveContext } from '../../utils/context.js';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivation = 'automatic' | 'manual';

export interface TabsTriggerEntry {
	value: string;
	disabled: boolean;
	element: HTMLElement | undefined;
}

export interface TabsRootState {
	readonly value: string | undefined;
	readonly disabled: boolean;
	readonly orientation: TabsOrientation;
	readonly rootId: string;
	select(value: string): void;
}

export interface TabsListState {
	readonly activation: TabsActivation;
	readonly focusedValue: string | undefined;
	readonly entries: Array<TabsTriggerEntry>;
	setFocusedValue(value: string | undefined): void;
	register(entry: TabsTriggerEntry): void;
	unregister(value: string): void;
	moveFocus(fromValue: string, key: string, source: HTMLElement): void;
}

/**
 * Deterministic tab/panel ids derived from the root id and value — stable
 * across SSR and hydration with no registration subsystem. Values must stay
 * unique after sanitization (documented on the props).
 */
export function getTabIds(rootId: string, value: string): { tabId: string; panelId: string } {
	const safe = value.replace(/[^A-Za-z0-9-_:.]/g, '-');
	return { tabId: `${rootId}-tab-${safe}`, panelId: `${rootId}-panel-${safe}` };
}

export const [getTabsRootState, setTabsRootState] = createPrimitiveContext<TabsRootState>('Tabs');
export const [getTabsListState, setTabsListState] =
	createPrimitiveContext<TabsListState>('TabsList');
