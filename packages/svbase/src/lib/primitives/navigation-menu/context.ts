import { createPrimitiveContext } from '../../utils/context.js';

export interface NavigationMenuState {
	readonly delay: number;
	readonly closeDelay: number;
	readonly disabled: boolean;
	cancelPending(): void;
	enterTrigger(value: string): void;
	leaveTrigger(dismiss: () => void): void;
	enterContent(): void;
	leaveContent(dismiss: () => void): void;
}

export const [getNavigationMenuState, setNavigationMenuState] =
	createPrimitiveContext<NavigationMenuState>('NavigationMenu');
