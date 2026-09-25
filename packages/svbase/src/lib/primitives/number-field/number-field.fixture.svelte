<script lang="ts">
	import { NumberField } from '../../index.js';

	let age: number | null = $state(null);
	let clamped: number | null = $state(30);
</script>

<NumberField.Root bind:value={age} name="age" min={0} max={150}>
	<NumberField.Group>
		<NumberField.Decrement>-</NumberField.Decrement>
		<NumberField.Input aria-label="Age" />
		<NumberField.Increment>+</NumberField.Increment>
	</NumberField.Group>
</NumberField.Root>
<p>Age: {age === null ? '—' : age}</p>

<NumberField.Root bind:value={clamped} min={0} max={100}>
	<NumberField.Input aria-label="Clamped" />
</NumberField.Root>
<p>Clamped: {clamped === null ? '—' : clamped}</p>
