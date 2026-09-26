<script lang="ts">
	import { CheckboxGroup } from 'svbase';

	import { groupBox, groupRow, card, hint } from '../demo.js';

	let toppings: Array<string> = $state([]);
</script>

<div class={card}>
	<CheckboxGroup.Root bind:value={toppings} name="topping" allValues={['cheese', 'pepperoni']}>
		<div class="flex flex-col gap-2">
			<CheckboxGroup.Parent class="{groupRow} {groupBox}">All toppings</CheckboxGroup.Parent>
			<CheckboxGroup.Item value="cheese" class="{groupRow} {groupBox}">Cheese</CheckboxGroup.Item>
			<CheckboxGroup.Item value="pepperoni" class="{groupRow} {groupBox}">
				Pepperoni
			</CheckboxGroup.Item>
		</div>
	</CheckboxGroup.Root>
	<p class={hint}>Toppings: {toppings.length ? toppings.join(', ') : '—'}</p>
</div>
