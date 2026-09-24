<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ThumbProps extends HTMLAttributes<HTMLElement> {
		/** Accessible name when no visible label is associated. */
		ariaLabel?: string | undefined;
		/** Delegated access to the thumb element. */
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/**
		 * Zero-based position in the values array. Required for every thumb
		 * past the first in multi-thumb sliders.
		 */
		index?: number;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { valueToPercent } from '../../utils/slider-math.js';

	import { getSliderState } from './context.js';

	type ThumbKeyboardEvent = Parameters<NonNullable<ThumbProps['onkeydown']>>[0];
	type ThumbPointerEvent = Parameters<NonNullable<ThumbProps['onpointerdown']>>[0];

	const state = getSliderState();

	let {
		index = 0,
		ariaLabel = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ThumbProps = $props();

	const value = $derived(state.values[index] ?? state.min);
	const percent = $derived(valueToPercent(value, state.min, state.max));
	// Logical inline-start mirrors automatically in RTL; vertical grows upward.
	// Consumer `style` appends after the position (string only).
	const positionStyle = $derived(
		(state.orientation === 'vertical'
			? `bottom: ${percent}%;`
			: `inset-inline-start: ${percent}%;`) + (typeof rest.style === 'string' ? rest.style : '')
	);

	function handleKeys(event: ThumbKeyboardEvent): void {
		if (state.disabled) return;
		const current = state.values[index] ?? state.min;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowLeft':
				event.preventDefault();
				state.setThumbValue(index, current - state.step);
				return;
			case 'ArrowUp':
			case 'ArrowRight':
				event.preventDefault();
				state.setThumbValue(index, current + state.step);
				return;
			case 'Home':
				event.preventDefault();
				state.setThumbValue(index, state.min);
				return;
			case 'End':
				event.preventDefault();
				state.setThumbValue(index, state.max);
				return;
			case 'PageUp':
				event.preventDefault();
				state.setThumbValue(index, current + state.largeStep);
				return;
			case 'PageDown':
				event.preventDefault();
				state.setThumbValue(index, current - state.largeStep);
				return;
		}
	}

	function handlePress(event: ThumbPointerEvent): void {
		state.thumbPress(event, index);
	}
</script>

<span
	{...rest}
	bind:this={ref}
	role="slider"
	aria-label={ariaLabel}
	aria-valuemin={state.min}
	aria-valuemax={state.max}
	aria-valuenow={value}
	aria-valuetext={state.format?.(value)}
	aria-disabled={state.disabled ? 'true' : undefined}
	tabindex={state.disabled ? -1 : 0}
	data-index={index}
	data-orientation={state.orientation}
	data-disabled={state.disabled ? '' : undefined}
	style={positionStyle}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
	onpointerdown={composeHandlers(rest.onpointerdown, handlePress)}
>
	{@render children?.()}
</span>
