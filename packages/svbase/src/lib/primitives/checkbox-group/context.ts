import { createPrimitiveContext } from '../../utils/context.js';

export type CheckboxGroupParentState = 'checked' | 'unchecked' | 'indeterminate';

export interface CheckboxGroupState {
	readonly value: Array<string>;
	readonly allValues: Array<string>;
	readonly disabled: boolean;
	readonly parentState: CheckboxGroupParentState;
	isChecked(itemValue: string): boolean;
	toggle(itemValue: string, checked: boolean): void;
	toggleAll(checked: boolean): void;
}

export const [getCheckboxGroupState, setCheckboxGroupState] =
	createPrimitiveContext<CheckboxGroupState>('CheckboxGroup');
