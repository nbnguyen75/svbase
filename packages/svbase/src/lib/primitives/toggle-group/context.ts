import { createPrimitiveContext } from '../../utils/context.js';

export interface ToggleGroupItemEntry {
	value: string;
	disabled: boolean;
	element: HTMLElement | undefined;
}

export interface ToggleGroupState {
	readonly multiple: boolean;
	readonly value: string | Array<string> | null;
	readonly disabled: boolean;
	readonly orientation: 'horizontal' | 'vertical';
	readonly entries: Array<ToggleGroupItemEntry>;
	isPressed(itemValue: string): boolean;
	toggle(itemValue: string, pressed: boolean): void;
	register(entry: ToggleGroupItemEntry): void;
	unregister(itemValue: string): void;
	moveFocus(fromValue: string, key: string, source: HTMLElement): void;
}

export const [getToggleGroupState, setToggleGroupState] =
	createPrimitiveContext<ToggleGroupState>('ToggleGroup');
