<script lang="ts" module>
	import type { TabsOrientation } from './context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLDivElement> {
		/** Fired with the next value whenever selection changes. */
		onValueChange?: ((value: string) => void) | undefined;
		/** Delegated access to the root element. */
		ref?: HTMLDivElement | undefined;
		/** Arrow-key axis. @default 'horizontal' */
		orientation?: TabsOrientation;
		/** Initially selected value for uncontrolled usage. */
		defaultValue?: string;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Selected tab value (controlled). `undefined` auto-selects the first enabled tab. */
		value?: string;
		/** Stable id prefix for tab/panel linkage. Generated when omitted. */
		id?: string;
	}
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';

	import { setTabsRootState } from './context.js';

	let {
		defaultValue = undefined,
		value = $bindable(defaultValue),
		disabled = false,
		orientation = 'horizontal',
		onValueChange = undefined,
		id: idProp = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	const rootId = $derived(idProp ?? createId('tabs'));

	function commit(next: string): void {
		onValueChange?.(next);
		value = next;
	}

	function select(itemValue: string): void {
		if (!disabled) commit(itemValue);
	}

	setTabsRootState({
		get value() {
			return value;
		},
		get disabled() {
			return disabled;
		},
		get orientation() {
			return orientation;
		},
		get rootId() {
			return rootId;
		},
		select
	});
</script>

<div
	{...rest}
	bind:this={ref}
	data-orientation={orientation}
	data-disabled={disabled ? '' : undefined}
>
	{@render children?.()}
</div>
