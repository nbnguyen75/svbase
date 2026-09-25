import { createPrimitiveContext } from '../../utils/context.js';

export interface OtpState {
	readonly value: string;
	readonly length: number;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	setChar(index: number, char: string): void;
	clearChar(index: number): void;
	pasteText(index: number, text: string): void;
	focusIndex(index: number): void;
	registerInput(index: number, element: HTMLInputElement | undefined): void;
}

export const [getOtpState, setOtpState] = createPrimitiveContext<OtpState>('OtpField');
