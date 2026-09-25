import { createPrimitiveContext } from '../../utils/context.js';

export interface MenubarMenuValue {
	readonly value: string;
}

export const [getMenubarMenuValue, setMenubarMenuValue] =
	createPrimitiveContext<MenubarMenuValue>('MenubarMenu');
