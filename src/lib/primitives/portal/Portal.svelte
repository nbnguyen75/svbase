<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface PortalProps {
		/** Where to render the content. Defaults to `document.body`. */
		target?: string | HTMLElement | undefined;
		/** When true, renders in place instead of teleporting. */
		disabled?: boolean;
		children?: Snippet;
	}

	let { target = undefined, disabled = false, children }: PortalProps = $props();

	let wrapper: HTMLDivElement | undefined = $state(undefined);

	$effect(() => {
		const element = wrapper;
		if (disabled || !element) return;
		const parent = element.parentNode;
		if (!parent) return;
		// Marker keeps Svelte's DOM bookkeeping intact: on cleanup the node
		// is moved back before the marker so Svelte can remove it normally.
		const marker = document.createComment('svbase-portal');
		parent.insertBefore(marker, element);
		const destination =
			typeof target === 'string' ? document.querySelector(target) : (target ?? document.body);
		if (!(destination instanceof Node)) {
			parent.insertBefore(element, marker);
			marker.remove();
			return;
		}
		destination.appendChild(element);
		return () => {
			marker.parentNode?.insertBefore(element, marker);
			marker.remove();
		};
	});
</script>

<div bind:this={wrapper} style:display="contents">
	{@render children?.()}
</div>
