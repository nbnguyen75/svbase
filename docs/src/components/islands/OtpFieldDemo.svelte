<script lang="ts">
	import { OtpField } from 'svbase';

	let code = $state('');
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<OtpField.Root bind:value={code} name="code" length={4}>
		<div class="flex items-center gap-2">
			<OtpField.Input
				index={0}
				aria-label="Digit 1"
				class="h-12 w-12 rounded-md border bg-transparent text-center text-lg"
			/>
			<OtpField.Input
				index={1}
				aria-label="Digit 2"
				class="h-12 w-12 rounded-md border bg-transparent text-center text-lg"
			/>
			<OtpField.Input
				index={2}
				aria-label="Digit 3"
				class="h-12 w-12 rounded-md border bg-transparent text-center text-lg"
			/>
			<OtpField.Input
				index={3}
				aria-label="Digit 4"
				class="h-12 w-12 rounded-md border bg-transparent text-center text-lg"
			/>
		</div>
	</OtpField.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Code: {code === '' ? '—' : code} (type, paste a code, or use Backspace to back up)
	</p>
</div>
