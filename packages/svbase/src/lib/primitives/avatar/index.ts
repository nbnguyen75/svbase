export { default as Root, type RootProps } from './Root.svelte';
export { default as Image, type ImageProps } from './Image.svelte';
export { default as Fallback, type FallbackProps } from './Fallback.svelte';
export {
	getAvatarState,
	setAvatarState,
	type AvatarState,
	type AvatarImageStatus
} from './context.js';
