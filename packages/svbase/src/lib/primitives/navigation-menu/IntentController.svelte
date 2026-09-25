<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface IntentControllerProps {
		children?: Snippet;
		delay?: number;
		closeDelay?: number;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { getMenubarState } from '../menubar/index.js';

	import { setNavigationMenuState } from './context.js';

	let { delay = 50, closeDelay = 50, disabled = false, children }: IntentControllerProps = $props();

	const menubar = getMenubarState();

	let openTimer: number | undefined = undefined;
	let closeTimer: number | undefined = undefined;

	onDestroy(() => {
		cancelPending();
	});

	function cancelPending(): void {
		window.clearTimeout(openTimer);
		window.clearTimeout(closeTimer);
		openTimer = undefined;
		closeTimer = undefined;
	}

	function scheduleClose(dismiss: () => void): void {
		cancelPending();
		const captured = menubar.openMenuValue;
		closeTimer = window.setTimeout(() => {
			closeTimer = undefined;
			if (captured === undefined || menubar.openMenuValue !== captured) return;
			dismiss();
		}, closeDelay);
	}

	setNavigationMenuState({
		get delay() {
			return delay;
		},
		get closeDelay() {
			return closeDelay;
		},
		get disabled() {
			return disabled;
		},
		cancelPending,
		enterTrigger(value: string) {
			cancelPending();
			if (disabled) return;
			// Switching between open menus is immediate; opening from
			// closed waits out the hover intent.
			if (menubar.openMenuValue !== undefined) menubar.requestOpen(value);
			else openTimer = window.setTimeout(() => menubar.requestOpen(value), delay);
		},
		leaveTrigger(dismiss: () => void) {
			window.clearTimeout(openTimer);
			openTimer = undefined;
			if (disabled) return;
			if (menubar.openMenuValue !== undefined) scheduleClose(dismiss);
		},
		enterContent() {
			cancelPending();
		},
		leaveContent(dismiss: () => void) {
			if (disabled) return;
			scheduleClose(dismiss);
		}
	});
</script>

{@render children?.()}
