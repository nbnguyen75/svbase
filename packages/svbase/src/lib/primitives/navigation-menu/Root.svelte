<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Arrow-key axis for moving between items. @default 'horizontal' */
		orientation?: 'horizontal' | 'vertical';
		/** Hover intent before closing. @default 50 */
		closeDelay?: number;
		children?: Snippet;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		/** Hover intent before opening from closed. @default 50 */
		delay?: number;
	}
</script>

<script lang="ts">
	import * as Menubar from '../menubar/index.js';

	import IntentController from './IntentController.svelte';

	let {
		delay = 50,
		closeDelay = 50,
		orientation = 'horizontal',
		disabled = false,
		children
	}: RootProps = $props();
</script>

<Menubar.Root {orientation} {disabled}>
	<IntentController {delay} {closeDelay} {disabled}>
		{@render children?.()}
	</IntentController>
</Menubar.Root>
