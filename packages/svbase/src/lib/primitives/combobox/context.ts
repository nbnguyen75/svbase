import { createPrimitiveContext } from '../../utils/context.js';
import type { FloatingPosition } from '../../utils/position.svelte.js';

export interface ComboboxItemEntry {
	value: string;
	label: string;
	disabled: boolean;
	element: HTMLElement | undefined;
	id: string;
}

export interface ComboboxRootState {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly value: string | null;
	readonly filter: string;
	readonly highlightedValue: string | undefined;
	readonly entries: Array<ComboboxItemEntry>;
	readonly visibleCount: number;
	readonly defaultContentId: string;
	readonly contentId: string | undefined;
	readonly position: FloatingPosition;
	readonly freeInput: boolean;
	openMenu(): void;
	closeMenu(): void;
	dismiss(): void;
	toggleMenu(): void;
	select(value: string | null): void;
	commitFreeText(): void;
	revertText(): void;
	setFilter(text: string): void;
	setHighlighted(value: string | undefined): void;
	register(entry: ComboboxItemEntry): void;
	unregister(value: string): void;
	moveHighlight(fromValue: string, key: string, source: HTMLElement): void;
	registerContentId(id: string | undefined): void;
	registerInput(element: HTMLInputElement | undefined): void;
	registerContent(element: HTMLElement | undefined): void;
	focusInput(): void;
	labelFor(value: string | null): string;
	matchesFilter(label: string): boolean;
}

export const [getComboboxRootState, setComboboxRootState] =
	createPrimitiveContext<ComboboxRootState>('Combobox');
