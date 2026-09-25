import { createPrimitiveContext } from '../../utils/context.js';

export interface ComboboxGroupState {
	readonly labelId: string | undefined;
	registerLabelId(id: string | undefined): void;
}

export const [getComboboxGroupState, setComboboxGroupState] =
	createPrimitiveContext<ComboboxGroupState>('ComboboxGroup');
