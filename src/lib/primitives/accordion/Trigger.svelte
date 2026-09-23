<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLButtonAttributes {
		/** Delegated access to the trigger element. */
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored (OR-ed with root/item). @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Underlying element tag, forwarded to Button. @default 'button' */
		element?: string;
		/** Overrides the generated id (panel links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button } from '../button/index.js';

	import { getAccordionItemState, getAccordionRootState } from './context.js';

	type TriggerMouseEvent = Parameters<NonNullable<TriggerProps['onclick']>>[0];
	type TriggerKeyboardEvent = Parameters<NonNullable<TriggerProps['onkeydown']>>[0];

	const root = getAccordionRootState();
	const item = getAccordionItemState();

	let {
		disabled: disabledProp = false,
		element = 'button',
		id = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const disabled = $derived(disabledProp || item.disabled);

	onMount(() => {
		root.registerTrigger({
			value: item.value,
			get disabled() {
				return disabled;
			},
			get element() {
				return ref;
			}
		});
		if (id) item.registerTriggerId(id);
		return () => {
			root.unregisterTrigger(item.value);
			item.registerTriggerId(undefined);
		};
	});

	function activate(): void {
		item.toggle();
	}

	function handleArrows(event: TriggerKeyboardEvent): void {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Home':
			case 'End':
				event.preventDefault();
				if (event.currentTarget instanceof HTMLElement)
					root.moveFocus(item.value, event.key, event.currentTarget);
				break;
		}
	}
</script>

<Button
	{...rest}
	{element}
	{disabled}
	bind:ref
	id={id ?? item.triggerId}
	aria-expanded={item.open}
	aria-controls={item.open ? item.panelId : undefined}
	data-state={item.open ? 'open' : 'closed'}
	onkeydown={composeHandlers(rest.onkeydown, handleArrows)}
	onclick={composeHandlers(rest.onclick, activate)}
>
	{@render children?.()}
</Button>
