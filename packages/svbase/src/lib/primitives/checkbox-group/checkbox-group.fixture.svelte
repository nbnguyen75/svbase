<script lang="ts">
	import { CheckboxGroup } from '../../index.js';

	let toppings: Array<string> = $state([]);
</script>

<CheckboxGroup.Root bind:value={toppings} name="topping" allValues={['cheese', 'pepperoni']}>
	<CheckboxGroup.Parent>All toppings</CheckboxGroup.Parent>
	<CheckboxGroup.Item value="cheese">Cheese</CheckboxGroup.Item>
	<CheckboxGroup.Item value="pepperoni">Pepperoni</CheckboxGroup.Item>
</CheckboxGroup.Root>
<p>Toppings: {toppings.length ? toppings.join(',') : '—'}</p>
