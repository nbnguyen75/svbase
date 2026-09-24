<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface ProviderProps {
		children?: Snippet;
		/**
		 * Auto-dismiss timeout in ms for toasts without their own
		 * `duration`. @default 5000
		 */
		timeout?: number;
	}
</script>

<script lang="ts">
	import { setToastProviderState } from './context.js';

	let { timeout = 5000, children }: ProviderProps = $props();

	setToastProviderState({
		get timeout() {
			return timeout;
		}
	});
</script>

{@render children?.()}
