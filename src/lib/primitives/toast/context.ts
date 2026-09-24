import { createPrimitiveContext } from '../../utils/context.js';

export interface ToastProviderState {
	/** Auto-dismiss timeout in ms for toasts without their own duration. */
	readonly timeout: number;
}

export const [getToastProviderState, setToastProviderState] =
	createPrimitiveContext<ToastProviderState>('ToastProvider');
