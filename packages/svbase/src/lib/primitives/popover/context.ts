import { createPrimitiveContext } from '../../utils/context.js';
import type { FloatingPosition } from '../../utils/position.svelte.js';

export interface PopoverState {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly defaultContentId: string;
	readonly contentId: string | undefined;
	readonly position: FloatingPosition;
	openPopover(): void;
	closePopover(): void;
	togglePopover(): void;
	registerTrigger(element: HTMLElement | undefined): void;
	registerContent(element: HTMLElement | undefined): void;
	registerContentId(id: string | undefined): void;
}

export const [getPopoverState, setPopoverState] = createPrimitiveContext<PopoverState>('Popover');
