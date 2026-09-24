import { createPrimitiveContext } from '../../utils/context.js';

export type ProgressStateValue = 'indeterminate' | 'progressing' | 'complete';

export interface ProgressState {
	readonly value: number | undefined;
	readonly min: number;
	readonly max: number;
	readonly format: ((value: number, max: number) => string) | undefined;
	readonly state: ProgressStateValue;
}

export const [getProgressState, setProgressState] =
	createPrimitiveContext<ProgressState>('Progress');
