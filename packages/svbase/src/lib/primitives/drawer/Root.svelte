<script lang="ts" module>
	import type { RootProps as DialogRootProps } from '../dialog/index.js';
	import type { DrawerSide } from './context.js';

	export interface RootProps extends DialogRootProps {
		/** Edge the drawer anchors to. @default 'right' */
		side?: DrawerSide;
	}
</script>

<script lang="ts">
	import { Root as DialogRoot } from '../dialog/index.js';

	import { setDrawerState } from './context.js';

	let { side = 'right', children, ...rest }: RootProps = $props();

	setDrawerState({
		get side() {
			return side;
		}
	});
</script>

<DialogRoot {...rest}>
	{@render children?.()}
</DialogRoot>
