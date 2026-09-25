<script lang="ts">
	import { OtpField } from '../../index.js';

	let code: string = $state('');
</script>

<OtpField.Root bind:value={code} name="code" length={4}>
	<OtpField.Input index={0} aria-label="Digit 1" />
	<OtpField.Input index={1} aria-label="Digit 2" />
	<OtpField.Input index={2} aria-label="Digit 3" />
	<OtpField.Input index={3} aria-label="Digit 4" />
</OtpField.Root>
<p>Code: {code === '' ? '—' : code}</p>
