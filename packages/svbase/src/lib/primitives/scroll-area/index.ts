export { default as Root, type RootProps } from './Root.svelte';
export { default as Scrollbar, type ScrollbarProps } from './Scrollbar.svelte';
export { default as Thumb, type ThumbProps } from './Thumb.svelte';
export { default as Viewport, type ViewportProps } from './Viewport.svelte';
export {
	getScrollAreaState,
	setScrollAreaState,
	type ScrollAreaState,
	type ScrollOrientation,
	type ScrollSnapshot
} from './context.js';
