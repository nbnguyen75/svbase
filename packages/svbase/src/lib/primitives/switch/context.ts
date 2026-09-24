import { createPrimitiveContext } from '../../utils/context.js';
import type { CheckableState } from '../../utils/state-attrs.js';

export type { CheckableState as SwitchState };
export const [getSwitchState, setSwitchState] = createPrimitiveContext<CheckableState>('Switch');
