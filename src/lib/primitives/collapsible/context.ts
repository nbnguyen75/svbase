import { createPrimitiveContext } from '../../utils/context.js';

export interface CollapsibleState {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly panelId: string;
	toggle(): void;
	registerPanelId(id: string | undefined): void;
}

export const [getCollapsibleState, setCollapsibleState] =
	createPrimitiveContext<CollapsibleState>('Collapsible');
