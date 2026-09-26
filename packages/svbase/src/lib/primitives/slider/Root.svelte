<script lang="ts" module>
	import type { SliderOrientation } from './context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLDivElement> {
		/** Fired when a change commits (key press, drag release). */
		onValueCommitted?: ((value: number | Array<number>) => void) | undefined;
		/** Fired on every value change (drag, keys). */
		onValueChange?: ((value: number | Array<number>) => void) | undefined;
		/** Human-readable value for `aria-valuetext` (e.g. currency). */
		format?: ((value: number) => string) | undefined;
		/** Initial value(s) for uncontrolled usage. @default min */
		defaultValue?: number | Array<number>;
		/** Delegated access to the root element. */
		ref?: HTMLDivElement | undefined;
		/** Axis and keyboard mapping. @default 'horizontal' */
		orientation?: SliderOrientation;
		/** Single value or one per thumb, in order (controlled). */
		value?: number | Array<number>;
		/** Minimum distance between thumbs. @default 0 */
		minStepsBetweenValues?: number;
		/** Accessible name when no visible label is associated. */
		ariaLabel?: string | undefined;
		/** PageUp/PageDown jump. @default 10 */
		largeStep?: number;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Value granularity. @default 1 */
		step?: number;
		/** Form field name (one hidden input per thumb). */
		name?: string;
		min?: number;
		max?: number;
	}
</script>

<script lang="ts">
	import { pushThumbValues, ratioToValue, valuesEqual } from '../../utils/slider-math.js';
	import { optionalContext } from '../../utils/context.js';

	import { setSliderState } from './context.js';
	import { getDirectionState } from '../direction/context.js';

	// Captured at init: component context is unavailable in event handlers.
	const direction = optionalContext(getDirectionState);

	let {
		defaultValue = undefined,
		value = $bindable(defaultValue ?? 0),
		min = 0,
		max = 100,
		step = 1,
		largeStep = 10,
		minStepsBetweenValues = 0,
		orientation = 'horizontal',
		disabled = false,
		name = undefined,
		ariaLabel = undefined,
		format = undefined,
		onValueChange = undefined,
		onValueCommitted = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	const isRange = $derived(Array.isArray(value));
	const values = $derived(Array.isArray(value) ? [...value] : [value]);

	function shape(next: Array<number>): number | Array<number> {
		return isRange ? next : (next[0] ?? min);
	}

	function setThumbValue(index: number, next: number, commitChange = true): void {
		if (disabled) return;
		const constrained = pushThumbValues(values, index, next, min, max, step, minStepsBetweenValues);
		if (valuesEqual(constrained, values)) return;
		const shaped = shape(constrained);
		onValueChange?.(shaped);
		value = shaped;
		if (commitChange) onValueCommitted?.(shaped);
	}

	// Drag state lives here (plain fields): the track element is registered
	// by Track, thumbs invoke pressThumb — all reads happen in event
	// handlers, so nothing is tracked and no update loops are possible.
	let trackEl: HTMLElement | undefined = undefined;
	let draggingIndex: number | undefined = undefined;
	let grabOffset = 0;

	function isRtl(): boolean {
		if (direction?.direction === 'rtl') return true;
		const track = trackEl;
		if (!track) return false;
		return track.closest('[dir="rtl"]') !== null || document.dir === 'rtl';
	}

	function valueFromClient(clientX: number, clientY: number): number | undefined {
		const track = trackEl;
		if (!track) return undefined;
		const rect = track.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return undefined;
		let ratio: number;
		if (orientation === 'vertical') ratio = (rect.bottom - clientY) / rect.height;
		else if (isRtl()) ratio = (rect.right - clientX) / rect.width;
		else ratio = (clientX - rect.left) / rect.width;
		return ratioToValue(ratio, min, max, step);
	}

	function nearestIndex(target: number): number {
		let best = 0;
		let bestDistance = Number.POSITIVE_INFINITY;
		for (let index = 0; index < values.length; index += 1) {
			const distance = Math.abs((values[index] ?? min) - target);
			if (distance < bestDistance) {
				bestDistance = distance;
				best = index;
			}
		}
		return best;
	}

	function beginDrag(event: PointerEvent, index: number, offset: number): void {
		draggingIndex = index;
		grabOffset = offset;
		try {
			trackEl?.setPointerCapture(event.pointerId);
		} catch {
			// Headless or detached environments may not support capture.
		}
		const thumb = trackEl?.querySelector(`[data-index="${index}"]`);
		if (thumb instanceof HTMLElement) thumb.focus({ preventScroll: true });
	}

	function trackPress(event: PointerEvent): void {
		if (disabled) return;
		const target = valueFromClient(event.clientX, event.clientY);
		if (target === undefined) return;
		// Track press jumps: grab the nearest thumb with no offset.
		beginDrag(event, nearestIndex(target), 0);
		trackMove(event);
	}

	function thumbPress(event: PointerEvent, index: number): void {
		if (disabled) return;
		event.stopPropagation();
		// Thumb press preserves the grab offset so the thumb never jumps.
		const current = values[index] ?? min;
		const target = valueFromClient(event.clientX, event.clientY);
		beginDrag(event, index, target === undefined ? 0 : target - current);
	}

	function trackMove(event: PointerEvent): void {
		if (draggingIndex === undefined || disabled) return;
		const target = valueFromClient(event.clientX, event.clientY);
		if (target === undefined) return;
		setThumbValue(draggingIndex, target - grabOffset, false);
	}

	function trackEnd(event: PointerEvent): void {
		const index = draggingIndex;
		if (index === undefined || disabled) return;
		const target = valueFromClient(event.clientX, event.clientY);
		const offset = grabOffset;
		draggingIndex = undefined;
		grabOffset = 0;
		try {
			trackEl?.releasePointerCapture(event.pointerId);
		} catch {
			// Already released or unsupported.
		}
		if (target === undefined) return;
		// Release always finalizes the gesture, even when the value
		// already settled during the last move event.
		const constrained = pushThumbValues(
			values,
			index,
			target - offset,
			min,
			max,
			step,
			minStepsBetweenValues
		);
		if (!valuesEqual(constrained, values)) {
			const shaped = shape(constrained);
			onValueChange?.(shaped);
			value = shaped;
		}
		onValueCommitted?.(shape(constrained));
	}

	setSliderState({
		get values() {
			return values;
		},
		get min() {
			return min;
		},
		get max() {
			return max;
		},
		get step() {
			return step;
		},
		get largeStep() {
			return largeStep;
		},
		get minStepsBetweenValues() {
			return minStepsBetweenValues;
		},
		get orientation() {
			return orientation;
		},
		get disabled() {
			return disabled;
		},
		get format() {
			return format;
		},
		setThumbValue,
		registerTrack(element: HTMLElement | undefined) {
			trackEl = element;
		},
		trackPress,
		thumbPress,
		trackMove,
		trackEnd
	});
</script>

<div
	{...rest}
	bind:this={ref}
	aria-label={ariaLabel}
	data-orientation={orientation}
	data-disabled={disabled ? '' : undefined}
>
	{@render children?.()}
	{#if name !== undefined}
		{#each values as thumbValue, index (index)}
			<input type="hidden" {name} value={thumbValue} disabled={disabled ? true : undefined} />
		{/each}
	{/if}
</div>
