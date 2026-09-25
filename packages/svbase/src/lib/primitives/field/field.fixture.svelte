<script lang="ts">
	import { Field, Input } from '../../index.js';
</script>

<Field.Root name="username">
	<Field.Label>Username</Field.Label>
	<Field.Control required minlength={3} />
	<Field.Description>3 or more characters.</Field.Description>
	<Field.Error />
</Field.Root>

<Field.Root
	name="bio"
	validate={(value) =>
		typeof value === 'string' && value.length > 0 && value.length < 10
			? 'Bio must be at least 10 characters.'
			: null}
>
	<Field.Label>Bio</Field.Label>
	<Field.Control />
	<Field.Error />
</Field.Root>

<Field.Root
	name="nickname"
	validationMode="onChange"
	validate={(value) => (value === 'taken' ? 'Name is taken.' : null)}
>
	<Field.Label>Nickname</Field.Label>
	<Field.Control />
	<Field.Error />
</Field.Root>

<Field.Root name="disabled-name" disabled>
	<Field.Label>Disabled name</Field.Label>
	<Field.Control required />
	<Field.Error />
</Field.Root>

<Input aria-label="Standalone" placeholder="Standalone input" />
