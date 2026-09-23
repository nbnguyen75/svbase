import { createPrimitiveContext } from '../internal/context.js';
import type { CheckableState } from '../internal/state-attrs.js';

export type { CheckableState as CheckboxState };
export const [getCheckboxState, setCheckboxState] =
	createPrimitiveContext<CheckableState>('Checkbox');
