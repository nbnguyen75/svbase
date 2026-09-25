import { createPrimitiveContext } from '../../utils/context.js';

export interface FormFieldRegistration {
	readonly id: string;
	readonly name: string | undefined;
	validate: () => boolean;
	getErrors: () => Array<string>;
	focus: () => void;
	reset: () => void;
	markSubmitted: () => void;
}

export type FormValidationMode = 'onSubmit' | 'onBlur' | 'onChange';

export interface FormState {
	readonly validationMode: FormValidationMode;
	registerField: (field: FormFieldRegistration) => void;
	unregisterField: (id: string) => void;
	markAllSubmitted: () => void;
	getValues: () => Record<string, string>;
}

export const [getFormState, setFormState] = createPrimitiveContext<FormState>('Form');
