import { createPrimitiveContext } from '../../utils/context.js';

export interface AccordionTriggerEntry {
	value: string;
	disabled: boolean;
	element: HTMLElement | undefined;
}

export interface AccordionRootState {
	readonly value: Array<string>;
	readonly disabled: boolean;
	readonly multiple: boolean;
	toggleValue(itemValue: string, nextOpen: boolean): void;
	registerTrigger(entry: AccordionTriggerEntry): void;
	unregisterTrigger(value: string): void;
	moveFocus(fromValue: string, key: string, source: HTMLElement): void;
}

export interface AccordionItemState {
	readonly open: boolean;
	readonly disabled: boolean;
	readonly value: string;
	readonly triggerId: string;
	readonly panelId: string;
	toggle(): void;
	registerTriggerId(id: string | undefined): void;
	registerPanelId(id: string | undefined): void;
}

export const [getAccordionRootState, setAccordionRootState] =
	createPrimitiveContext<AccordionRootState>('Accordion');
export const [getAccordionItemState, setAccordionItemState] =
	createPrimitiveContext<AccordionItemState>('AccordionItem');
