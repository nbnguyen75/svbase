<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		ref?: HTMLDivElement | undefined;
		/** Overrides the generated id (input links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Content as MenuContent } from '../dropdown-menu/index.js';
	import { getMenuRootState } from '../dropdown-menu/index.js';

	import { getNavigationMenuState } from './context.js';

	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ContentProps = $props();

	const nav = getNavigationMenuState();
	const menu = getMenuRootState();

	function handleEnter(): void {
		nav.enterContent();
	}

	function handleLeave(): void {
		nav.leaveContent(() => menu.dismiss());
	}
</script>

<MenuContent
	{...rest}
	bind:ref
	onpointerenter={composeHandlers(rest.onpointerenter, handleEnter)}
	onpointerleave={composeHandlers(rest.onpointerleave, handleLeave)}
>
	{@render children?.()}
</MenuContent>
