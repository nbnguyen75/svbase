<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	import { setAvatarState, type AvatarImageStatus } from './context.js';

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	let status = $state<AvatarImageStatus>('idle');

	setAvatarState({
		get status() {
			return status;
		},
		setStatus(next: AvatarImageStatus) {
			status = next;
		}
	});
</script>

<span {...rest} bind:this={ref} data-status={status}>
	{@render children?.()}
</span>
