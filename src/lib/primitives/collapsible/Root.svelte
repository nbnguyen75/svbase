<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLDivElement> {
		/** Fired with the next state whenever the panel opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Delegated access to the root element. */
		ref?: HTMLDivElement | undefined;
		/** Initially open for uncontrolled usage. @default false */
		defaultOpen?: boolean;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Whether the panel is open (controlled). */
		open?: boolean;
	}
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';

	import { setCollapsibleState } from './context.js';

	let {
		defaultOpen = false,
		open = $bindable(defaultOpen),
		disabled = false,
		onOpenChange = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	let panelIdOverride = $state<string | undefined>(undefined);
	const fallbackPanelId = createId('collapsible-panel');

	function toggle(): void {
		const next = !open;
		onOpenChange?.(next);
		open = next;
	}

	function registerPanelId(id: string | undefined): void {
		panelIdOverride = id;
	}

	setCollapsibleState({
		get open() {
			return open;
		},
		get disabled() {
			return disabled;
		},
		get panelId() {
			return panelIdOverride ?? fallbackPanelId;
		},
		toggle,
		registerPanelId
	});
</script>

<div
	{...rest}
	bind:this={ref}
	data-state={open ? 'open' : 'closed'}
	data-disabled={disabled ? '' : undefined}
>
	{@render children?.()}
</div>
