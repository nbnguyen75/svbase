import { createPrimitiveContext } from '../../utils/context.js';
import type { CheckableState } from '../../utils/state-attrs.js';

export type { CheckableState as CheckboxState };
export const [getCheckboxState, setCheckboxState] =
	createPrimitiveContext<CheckableState>('Checkbox');
