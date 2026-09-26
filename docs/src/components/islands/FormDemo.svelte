<script lang="ts">
	import { Fieldset, Field, Input, Form } from 'svbase';

	let result = $state('—');
	let errorReport = $state('—');
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Form.Form
		onFormSubmit={(values, errors) => {
			result = JSON.stringify(values);
			errorReport = JSON.stringify(errors);
		}}
	>
		<Field.Root name="email">
			<Field.Label>Email</Field.Label>
			<Field.Control type="email" required placeholder="you@example.com" />
			<Field.Description>We never share it.</Field.Description>
			<Field.Error />
		</Field.Root>
		<Field.Root
			name="username"
			validate={(value) =>
				typeof value === 'string' && value.length < 3 ? 'At least 3 characters.' : null}
		>
			<Field.Label>Username</Field.Label>
			<Field.Control placeholder="ada" />
			<Field.Error />
		</Field.Root>
		<Fieldset.Root>
			<Fieldset.Legend>Notifications</Fieldset.Legend>
			<Field.Root name="newsletter">
				<Field.Label>Newsletter</Field.Label>
				<Input placeholder="Optional" />
			</Field.Root>
		</Fieldset.Root>
		<div class="flex flex-wrap items-center gap-3">
			<button
				type="submit"
				class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
			>
				Save
			</button>
			<button
				type="reset"
				class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			>
				Reset
			</button>
		</div>
	</Form.Form>
	<p class="mt-3 text-sm text-muted-foreground">Values: <code>{result}</code></p>
	<p class="mt-3 text-sm text-muted-foreground">Errors: <code>{errorReport}</code></p>
</div>
