import { createPrimitiveContext } from '../../utils/context.js';

export interface SelectGroupState {
	readonly groupId: string;
	readonly labelId: string | undefined;
	registerLabelId(id: string | undefined): void;
}

export const [getSelectGroupState, setSelectGroupState] =
	createPrimitiveContext<SelectGroupState>('SelectGroup');
