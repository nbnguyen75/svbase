<script lang="ts">
	import { Checkbox, Button } from 'svbase';

	let checkboxChecked = $state(false);
	let submitted = $state('—');
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<div class="flex flex-wrap items-center gap-3">
		<Checkbox.Root
			onCheckedChange={(checked) => {
				checkboxChecked = checked;
			}}
		>
			<Checkbox.Indicator>✓</Checkbox.Indicator>
			Subscribe (uncontrolled)
		</Checkbox.Root>
		<Checkbox.Root indeterminate>
			<Checkbox.Indicator>✓</Checkbox.Indicator>
			Indeterminate
		</Checkbox.Root>
		<Checkbox.Root disabled>
			<Checkbox.Indicator>✓</Checkbox.Indicator>
			Disabled
		</Checkbox.Root>
		<Checkbox.Root readOnly checked>
			<Checkbox.Indicator>✓</Checkbox.Indicator>
			Read-only
		</Checkbox.Root>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">Last change: {checkboxChecked ? 'checked' : 'unchecked'}</p>
	<form
		class="flex flex-wrap items-center gap-3"
		onsubmit={(event) => {
			event.preventDefault();
			const data = new FormData(event.currentTarget);
			submitted = `agree=${data.get('agree')} newsletter=${data.get('newsletter')}`;
		}}
	>
		<Checkbox.Root name="agree" value="yes">
			<Checkbox.Indicator>✓</Checkbox.Indicator>
			Agree (required)
		</Checkbox.Root>
		<Checkbox.Root name="newsletter" value="yes" uncheckedValue="no">
			<Checkbox.Indicator>✓</Checkbox.Indicator>
			Newsletter (unchecked submits "no")
		</Checkbox.Root>
		<Button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
			type="submit"
		>
			Submit form
		</Button>
	</form>
	<p class="mt-3 text-sm text-muted-foreground">Submitted: <code>{submitted}</code></p>
</div>
