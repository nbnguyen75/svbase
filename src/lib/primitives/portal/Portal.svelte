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
		// Marker remembers the home position for the invalid-target path below.
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
			// Remove outright instead of moving back: unmount clears the
			// container's current children, so a moved-back node would be
			// missed; `remove()` on a detached node is a harmless no-op.
			marker.remove();
			element.remove();
		};
	});
</script>

<div bind:this={wrapper} style:display="contents">
	{@render children?.()}
</div>
