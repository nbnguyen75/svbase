<script lang="ts">
	import { RadioGroup } from '$lib/index.js';

	let size = $state<string | undefined>(undefined);
	let submitted = $state('—');
</script>

<h1>Radio Group</h1>
<p>Single-select group with roving tabindex and arrow-key navigation.</p>

<section>
	<RadioGroup.Root
		name="size"
		bind:value={size}
		onValueChange={(next) => {
			size = next;
		}}
	>
		<RadioGroup.Item value="s">Small</RadioGroup.Item>
		<RadioGroup.Item value="m" disabled>Medium (disabled)</RadioGroup.Item>
		<RadioGroup.Item value="l">
			<RadioGroup.Indicator>●</RadioGroup.Indicator>
			Large
		</RadioGroup.Item>
	</RadioGroup.Root>
	<p>Selected: {size ?? '—'} (Tab in, then use arrows — Medium is skipped, selection wraps)</p>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = String(new FormData(event.currentTarget).get('plan') ?? 'none');
		}}
	>
		<RadioGroup.Root name="plan" required>
			<RadioGroup.Item value="free">Free</RadioGroup.Item>
			<RadioGroup.Item value="pro">Pro</RadioGroup.Item>
		</RadioGroup.Root>
		<button type="submit">Submit (required blocks empty submit)</button>
	</form>
	<p>Submitted plan: <code>{submitted}</code></p>
</section>

<section>
	<h2>Vertical</h2>
	<RadioGroup.Root name="align" orientation="vertical" defaultValue="left">
		<RadioGroup.Item value="left">Left</RadioGroup.Item>
		<RadioGroup.Item value="center">Center</RadioGroup.Item>
		<RadioGroup.Item value="right">Right</RadioGroup.Item>
	</RadioGroup.Root>
</section>
