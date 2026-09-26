<script lang="ts">
	import { RadioGroup } from 'svbase';

	let plan: string | null = $state('pro');
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<RadioGroup.Root name="plan" bind:value={plan} aria-label="Plan">
		<div class="flex flex-wrap items-center gap-3">
			<label class="flex items-center gap-2 text-sm">
				<RadioGroup.Item
					value="free"
					class="grid size-4 place-items-center rounded-full border data-checked:border-primary"
				>
					<RadioGroup.Indicator class="size-2 rounded-full bg-primary" />
				</RadioGroup.Item>
				Free
			</label>
			<label class="flex items-center gap-2 text-sm">
				<RadioGroup.Item
					value="pro"
					class="grid size-4 place-items-center rounded-full border data-checked:border-primary"
				>
					<RadioGroup.Indicator class="size-2 rounded-full bg-primary" />
				</RadioGroup.Item>
				Pro
			</label>
			<label class="flex items-center gap-2 text-sm opacity-60">
				<RadioGroup.Item
					value="team"
					disabled
					class="grid size-4 place-items-center rounded-full border"
				>
					<RadioGroup.Indicator class="size-2 rounded-full bg-primary" />
				</RadioGroup.Item>
				Team (soon)
			</label>
		</div>
	</RadioGroup.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Plan: {plan ?? '—'} (arrows move + select; Tab enters the group)
	</p>
</div>
