import { createPrimitiveContext } from '../../utils/context.js';

export type SliderOrientation = 'horizontal' | 'vertical';

export interface SliderState {
	readonly values: Array<number>;
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly largeStep: number;
	readonly minStepsBetweenValues: number;
	readonly orientation: SliderOrientation;
	readonly disabled: boolean;
	readonly format: ((value: number) => string) | undefined;
	setThumbValue(index: number, next: number, commitChange?: boolean): void;
	registerTrack(element: HTMLElement | undefined): void;
	trackPress(event: PointerEvent): void;
	thumbPress(event: PointerEvent, index: number): void;
	trackMove(event: PointerEvent): void;
	trackEnd(event: PointerEvent): void;
}

export const [getSliderState, setSliderState] = createPrimitiveContext<SliderState>('Slider');
