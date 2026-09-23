import { createPrimitiveContext } from '../../utils/context.js';

export interface MenuRadioGroupState {
	readonly value: string | undefined;
	select(value: string): void;
}

export const [getMenuRadioGroupState, setMenuRadioGroupState] =
	createPrimitiveContext<MenuRadioGroupState>('MenuRadioGroup');
