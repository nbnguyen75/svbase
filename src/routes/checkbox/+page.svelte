<script lang="ts">
	import { Checkbox } from '$lib/index.js';

	let checkboxChecked = $state(false);
	let submitted = $state('—');
</script>

<h1>Checkbox</h1>
<p>Accessible checkbox with indeterminate state and hidden form input.</p>

<section>
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
	<p>Last change: {checkboxChecked ? 'checked' : 'unchecked'}</p>
	<form
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
		<button type="submit">Submit form</button>
	</form>
	<p>Submitted: <code>{submitted}</code></p>
</section>
