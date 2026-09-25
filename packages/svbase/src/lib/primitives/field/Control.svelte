<script lang="ts" module>
	import type { InputProps } from '../input/index.js';

	export type ControlProps = InputProps;
</script>

<script lang="ts">
	import { Input } from '../input/index.js';

	import { getFieldState } from './context.js';

	let {
		name = undefined,
		id = undefined,
		disabled = false,
		required = false,
		...rest
	}: ControlProps = $props();

	// Throws outside a Field root — Control is meaningless without one.
	const field = getFieldState();
</script>

<Input
	name={name ?? field.name}
	id={id ?? field.controlId}
	disabled={disabled || field.disabled}
	{required}
	{...rest}
/>
