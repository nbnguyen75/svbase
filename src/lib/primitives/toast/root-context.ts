import { createPrimitiveContext } from '../../utils/context.js';

export interface ToastRootState {
	closeToast(): void;
}

export const [getToastRootState, setToastRootState] =
	createPrimitiveContext<ToastRootState>('ToastRoot');
