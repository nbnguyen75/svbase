<script lang="ts" module>
	import type { RootProps as DialogRootProps } from '../dialog/index.js';
	import type { Snippet } from 'svelte';

	export interface RootProps extends Omit<DialogRootProps, 'role' | 'disablePointerDismissal'> {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { Root as DialogRoot } from '../dialog/index.js';

	let { children, ...rest }: RootProps = $props();
</script>

<DialogRoot {...rest} role="alertdialog" disablePointerDismissal>
	{@render children?.()}
</DialogRoot>
