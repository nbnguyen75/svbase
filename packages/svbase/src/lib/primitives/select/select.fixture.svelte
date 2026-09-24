<script lang="ts">
	import { Select } from '../../index.js';
</script>

<Select.Root name="fruit">
	<Select.Trigger data-testid="fruit-trigger" aria-label="Fruit">
		<Select.Value placeholder="Pick a fruit" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content>
			<Select.Viewport>
				<Select.Item value="apple">Apple</Select.Item>
				<Select.Item value="banana">Banana</Select.Item>
				<Select.Item value="cherry" disabled>Cherry</Select.Item>
				<Select.Group>
					<Select.Label>Citrus</Select.Label>
					<Select.Item value="orange">Orange</Select.Item>
					<Select.Item value="lemon">Lemon</Select.Item>
				</Select.Group>
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
