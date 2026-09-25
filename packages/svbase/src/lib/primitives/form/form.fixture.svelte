<script lang="ts">
	import { Field, Form } from '../../index.js';

	let result = $state('none');
	let errorReport = $state('none');
</script>

<Form.Form
	onFormSubmit={(values, errors) => {
		result = JSON.stringify(values);
		errorReport = JSON.stringify(errors);
	}}
>
	<Field.Root name="email">
		<Field.Label>Email</Field.Label>
		<Field.Control type="email" required />
		<Field.Error />
	</Field.Root>
	<Field.Root name="nick">
		<Field.Label>Nick</Field.Label>
		<Field.Control required minlength={2} />
		<Field.Error />
	</Field.Root>
	<button type="submit">Save</button>
	<button type="reset">Reset</button>
</Form.Form>
<p>Result: {result}</p>
<p>Errors: {errorReport}</p>
