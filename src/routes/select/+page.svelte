<script lang="ts">
	import { Select } from '$lib/index.js';

	let fruit: string | null = $state(null);
</script>

<h1>Select</h1>
<p>Single-select dropdown with typeahead and form sync.</p>

<section>
	<Select.Root name="fruit" bind:value={fruit}>
		<Select.Trigger aria-label="Fruit">
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
	<p>
		Selected: {fruit ?? '—'} (Tab in, arrows select directly; Enter opens; type a letter to jump)
	</p>
</section>
