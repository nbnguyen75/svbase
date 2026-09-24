import { createPrimitiveContext } from '../../utils/context.js';

export type DialogRole = 'dialog' | 'alertdialog';

export interface DialogState {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly disablePointerDismissal: boolean;
	readonly role: DialogRole;
	readonly defaultTitleId: string;
	readonly defaultDescriptionId: string;
	readonly defaultContentId: string;
	/** Defined only while the respective part is mounted. */
	readonly titleId: string | undefined;
	readonly descriptionId: string | undefined;
	readonly contentId: string | undefined;
	openDialog(): void;
	closeDialog(): void;
	toggleDialog(): void;
	registerTrigger(element: HTMLElement | undefined): void;
	registerContent(element: HTMLElement | undefined): void;
	registerTitleId(id: string | undefined): void;
	registerDescriptionId(id: string | undefined): void;
	registerContentId(id: string | undefined): void;
}

export const [getDialogState, setDialogState] = createPrimitiveContext<DialogState>('Dialog');
