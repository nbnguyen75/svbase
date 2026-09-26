import { createPrimitiveContext } from '../../utils/context.js';

export type TextDirection = 'ltr' | 'rtl';

export interface DirectionState {
	readonly direction: TextDirection;
}

export const [getDirectionState, setDirectionState] =
	createPrimitiveContext<DirectionState>('Direction');
