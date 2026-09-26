<script lang="ts">
	import { CheckboxGroup } from 'svbase';

	let toppings: Array<string> = $state([]);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<CheckboxGroup.Root bind:value={toppings} name="topping" allValues={['cheese', 'pepperoni']}>
		<div class="flex flex-col gap-2">
			<CheckboxGroup.Parent>All toppings</CheckboxGroup.Parent>
			<CheckboxGroup.Item value="cheese">Cheese</CheckboxGroup.Item>
			<CheckboxGroup.Item value="pepperoni">Pepperoni</CheckboxGroup.Item>
		</div>
	</CheckboxGroup.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Toppings: {toppings.length ? toppings.join(', ') : '—'}
	</p>
</div>
