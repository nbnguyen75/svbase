import { createPrimitiveContext } from '../../utils/context.js';

export type FieldValidationMode = 'onBlur' | 'onChange' | 'onSubmit';

export interface FieldControlHandle {
	element: () => HTMLInputElement | null;
	getValue: () => unknown;
}

export interface FieldState {
	controlId: string;
	descriptionId: string;
	errorId: string;
	readonly name: string | undefined;
	readonly disabled: boolean;
	readonly valid: boolean | null;
	readonly dirty: boolean;
	readonly touched: boolean;
	readonly filled: boolean;
	readonly focused: boolean;
	readonly error: string;
	registerControl: (control: FieldControlHandle) => void;
	unregisterControl: () => void;
	setHasDescription: (present: boolean) => void;
	setHasError: (present: boolean) => void;
	getDescribedBy: () => string | undefined;
	handleChange: () => void;
	handleBlur: () => void;
	handleFocus: () => void;
	/** Runs validation for the given trigger; returns whether the field is valid. */
	validate: (source: 'change' | 'blur' | 'submit') => boolean;
	/** Called by Form on submit so onSubmit-mode fields validate on change afterwards. */
	markSubmitted: () => void;
	focusControl: () => void;
	resetField: () => void;
}

export const [getFieldState, setFieldState] = createPrimitiveContext<FieldState>('Field');
