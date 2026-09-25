<script lang="ts">
	import { Combobox } from '../../index.js';

	let strictValue: string | null = $state(null);
	let freeValue: string | null = $state(null);
</script>

<Combobox.Root bind:value={strictValue} name="fruit">
	<Combobox.Input aria-label="Fruit" placeholder="Pick a fruit" />
	<Combobox.Portal>
		<Combobox.Content>
			<Combobox.Item value="apple">Apple</Combobox.Item>
			<Combobox.Item value="banana">Banana</Combobox.Item>
			<Combobox.Item value="cherry" disabled>Cherry</Combobox.Item>
			<Combobox.Group>
				<Combobox.GroupLabel>Citrus</Combobox.GroupLabel>
				<Combobox.Item value="orange">Orange</Combobox.Item>
				<Combobox.Item value="lemon">Lemon</Combobox.Item>
			</Combobox.Group>
			<Combobox.Empty>No matches</Combobox.Empty>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
<p>Strict: {strictValue ?? '—'}</p>

<Combobox.Root bind:value={freeValue} freeInput>
	<Combobox.Input aria-label="City" placeholder="Type any city" />
	<Combobox.Portal>
		<Combobox.Content>
			<Combobox.Item value="paris">Paris</Combobox.Item>
			<Combobox.Item value="porto">Porto</Combobox.Item>
			<Combobox.Empty>No city matches</Combobox.Empty>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
<p>Free: {freeValue ?? '—'}</p>
