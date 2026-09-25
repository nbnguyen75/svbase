import { createPrimitiveContext } from '../../utils/context.js';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerState {
	readonly side: DrawerSide;
}

export const [getDrawerState, setDrawerState] = createPrimitiveContext<DrawerState>('Drawer');
