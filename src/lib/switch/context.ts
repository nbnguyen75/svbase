import { createPrimitiveContext } from '../internal/context.js';
import type { CheckableState } from '../internal/state-attrs.js';

export type { CheckableState as SwitchState };
export const [getSwitchState, setSwitchState] = createPrimitiveContext<CheckableState>('Switch');
