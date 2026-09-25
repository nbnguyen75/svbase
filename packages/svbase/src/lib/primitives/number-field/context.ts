import { createPrimitiveContext } from '../../utils/context.js';

export interface NumberFieldState {
	readonly value: number | null;
	readonly min: number | undefined;
	readonly max: number | undefined;
	readonly step: number;
	readonly largeStep: number;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	increment(): void;
	decrement(): void;
	/** Parses + clamps text, commits, and returns the committed value (for input sync). */
	commitText(text: string): number | null;
	focusInput(): void;
	registerInput(element: HTMLInputElement | undefined): void;
}

export const [getNumberFieldState, setNumberFieldState] =
	createPrimitiveContext<NumberFieldState>('NumberField');
