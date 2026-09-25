import { createPrimitiveContext } from '../../utils/context.js';

export interface ToolbarItemEntry {
	disabled: boolean;
	focusable: boolean;
	element: HTMLElement | undefined;
}

export interface ToolbarState {
	readonly orientation: 'horizontal' | 'vertical';
	readonly disabled: boolean;
	register(entry: ToolbarItemEntry): void;
	unregister(element: HTMLElement | undefined): void;
	moveFocus(fromElement: HTMLElement, key: string): void;
	isTabStop(element: HTMLElement | undefined): boolean;
}

export const [getToolbarState, setToolbarState] = createPrimitiveContext<ToolbarState>('Toolbar');
