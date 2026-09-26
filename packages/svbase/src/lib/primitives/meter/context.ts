import { createPrimitiveContext } from '../../utils/context.js';

export interface MeterState {
	readonly value: number;
	readonly min: number;
	readonly max: number;
	readonly percent: number;
	readonly formatted: string;
}

export const [getMeterState, setMeterState] = createPrimitiveContext<MeterState>('Meter');
