import { createPrimitiveContext } from '../../utils/context.js';

export type ScrollOrientation = 'horizontal' | 'vertical';

export interface ScrollSnapshot {
	scrollTop: number;
	scrollHeight: number;
	clientHeight: number;
	scrollLeft: number;
	scrollWidth: number;
	clientWidth: number;
}

export interface ScrollAreaState {
	readonly scroll: ScrollSnapshot;
	readonly viewportElement: HTMLElement | undefined;
	refresh(): void;
	scrollTo(top: number, left: number): void;
	registerViewport(element: HTMLElement | undefined): void;
}

export const [getScrollAreaState, setScrollAreaState] =
	createPrimitiveContext<ScrollAreaState>('ScrollArea');
