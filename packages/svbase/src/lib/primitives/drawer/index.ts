export { default as Root, type RootProps } from './Root.svelte';
export { default as Content, type ContentProps } from './Content.svelte';
// Drawer behavior is the dialog controller; the remaining parts are the
// dialog engine re-exported unchanged.
export {
	Trigger,
	type TriggerProps,
	Overlay,
	type OverlayProps,
	Title,
	type TitleProps,
	Description,
	type DescriptionProps,
	Close,
	type CloseProps,
	Portal,
	type PortalProps
} from '../dialog/index.js';
