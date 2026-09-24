import { createPrimitiveContext } from '../../utils/context.js';
import type { FloatingPosition } from '../../utils/position.svelte.js';

export interface SelectItemEntry {
	value: string;
	disabled: boolean;
	element: HTMLElement | undefined;
	label: string;
}

export interface SelectRootState {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly defaultContentId: string;
	readonly contentId: string | undefined;
	readonly position: FloatingPosition;
	readonly value: string | null;
	readonly highlightedValue: string | undefined;
	readonly entries: Array<SelectItemEntry>;
	openMenu(): void;
	closeMenu(): void;
	dismiss(): void;
	toggleMenu(): void;
	focusTrigger(): void;
	select(value: string): void;
	setHighlighted(value: string | undefined): void;
	register(entry: SelectItemEntry): void;
	unregister(value: string): void;
	moveHighlight(fromValue: string, key: string, source: HTMLElement): void;
	typeahead(char: string): void;
	findMatch(buffer: string, fromValue: string): string | undefined;
	consumeInitialFocus(): boolean;
	focusHighlighted(): void;
	requestInitialFocus(): void;
	registerContentId(id: string | undefined): void;
	registerTrigger(element: HTMLElement | undefined): void;
	registerContent(element: HTMLElement | undefined): void;
}

export const [getSelectRootState, setSelectRootState] =
	createPrimitiveContext<SelectRootState>('Select');
