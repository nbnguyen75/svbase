<script lang="ts">
	import { Checkbox, Button } from 'svbase';

	import { btnPrimary, checkMark, checkBox, label, card, hint, row } from '../demo.js';

	let checkboxChecked = $state(false);
	let submitted = $state('—');
</script>

<div class={card}>
	<div class={row}>
		<label class={label}>
			<Checkbox.Root
				class={checkBox}
				onCheckedChange={(checked) => {
					checkboxChecked = checked;
				}}
			>
				<Checkbox.Indicator class={checkMark}>✓</Checkbox.Indicator>
			</Checkbox.Root>
			Subscribe (uncontrolled)
		</label>
		<label class={label}>
			<Checkbox.Root indeterminate class={checkBox}>
				<Checkbox.Indicator class={checkMark}>✓</Checkbox.Indicator>
			</Checkbox.Root>
			Indeterminate
		</label>
		<label class="{label} opacity-60">
			<Checkbox.Root disabled class={checkBox}>
				<Checkbox.Indicator class={checkMark}>✓</Checkbox.Indicator>
			</Checkbox.Root>
			Disabled
		</label>
		<label class={label}>
			<Checkbox.Root readOnly checked class={checkBox}>
				<Checkbox.Indicator class={checkMark}>✓</Checkbox.Indicator>
			</Checkbox.Root>
			Read-only
		</label>
	</div>
	<p class={hint}>Last change: {checkboxChecked ? 'checked' : 'unchecked'}</p>
	<form
		class={row}
		onsubmit={(event) => {
			event.preventDefault();
			const data = new FormData(event.currentTarget);
			submitted = `agree=${data.get('agree')} newsletter=${data.get('newsletter')}`;
		}}
	>
		<label class={label}>
			<Checkbox.Root name="agree" value="yes" class={checkBox}>
				<Checkbox.Indicator class={checkMark}>✓</Checkbox.Indicator>
			</Checkbox.Root>
			Agree (required)
		</label>
		<label class={label}>
			<Checkbox.Root name="newsletter" value="yes" uncheckedValue="no" class={checkBox}>
				<Checkbox.Indicator class={checkMark}>✓</Checkbox.Indicator>
			</Checkbox.Root>
			Newsletter (unchecked submits "no")
		</label>
		<Button class={btnPrimary} type="submit">Submit form</Button>
	</form>
	<p class={hint}>Submitted: <code>{submitted}</code></p>
</div>
