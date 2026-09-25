<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface ItemProps {
		children?: Snippet;
		/** Unique item id within the navigation menu. */
		value: string;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import * as Menubar from '../menubar/index.js';

	let { value, disabled = false, children }: ItemProps = $props();
</script>

<Menubar.Menu {value} {disabled}>
	{@render children?.()}
</Menubar.Menu>
