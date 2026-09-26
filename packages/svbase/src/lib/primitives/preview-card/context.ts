import { createPrimitiveContext } from '../../utils/context.js';
import type { FloatingPosition } from '../../utils/position.svelte.js';

export interface PreviewCardState {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly defaultContentId: string;
	readonly contentId: string | undefined;
	readonly position: FloatingPosition;
	openCard(): void;
	closeCard(): void;
	toggleCard(): void;
	scheduleOpen(): void;
	scheduleClose(): void;
	cancelPending(): void;
	registerTrigger(element: HTMLElement | undefined): void;
	registerContent(element: HTMLElement | undefined): void;
	registerContentId(id: string | undefined): void;
}

export const [getPreviewCardState, setPreviewCardState] =
	createPrimitiveContext<PreviewCardState>('PreviewCard');
