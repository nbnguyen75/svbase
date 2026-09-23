import { createPrimitiveContext } from '../../utils/context.js';

export type RadioOrientation = 'horizontal' | 'vertical';

export interface RadioItemEntry {
	value: string;
	disabled: boolean;
	element: HTMLElement | undefined;
}

export interface RadioGroupState {
	readonly checkedValue: string | undefined;
	readonly disabled: boolean;
	readonly required: boolean;
	readonly readOnly: boolean;
	readonly orientation: RadioOrientation;
	readonly name: string | undefined;
	readonly form: string | undefined;
	readonly entries: Array<RadioItemEntry>;
	select(value: string): void;
	register(entry: RadioItemEntry): void;
	unregister(value: string): void;
	move(fromValue: string, key: string, source: HTMLElement): void;
}

export interface RadioItemState {
	readonly checked: boolean;
	readonly disabled: boolean;
	readonly required: boolean;
	readonly readOnly: boolean;
}

export const [getRadioGroupState, setRadioGroupState] =
	createPrimitiveContext<RadioGroupState>('RadioGroup');
export const [getRadioItemState, setRadioItemState] =
	createPrimitiveContext<RadioItemState>('RadioItem');
