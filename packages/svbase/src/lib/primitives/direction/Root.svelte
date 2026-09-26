<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { TextDirection } from './context.js';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
		/** Base direction for the subtree. @default 'ltr' */
		direction?: TextDirection;
	}
</script>

<script lang="ts">
	import { setDirectionState } from './context.js';

	let {
		direction = $bindable<TextDirection>('ltr'),
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	setDirectionState({
		get direction() {
			return direction;
		}
	});
</script>

<div {...rest} bind:this={ref} dir={direction} data-direction={direction}>
	{@render children?.()}
</div>
