import { createPrimitiveContext } from '../../utils/context.js';

export interface FieldsetState {
	readonly disabled: boolean;
}

export const [getFieldsetState, setFieldsetState] =
	createPrimitiveContext<FieldsetState>('Fieldset');
