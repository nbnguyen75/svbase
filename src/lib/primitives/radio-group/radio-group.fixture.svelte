<script lang="ts">
	import { RadioGroup } from '$lib/index.js';
</script>

<RadioGroup.Root name="size">
	<RadioGroup.Item value="s">Small</RadioGroup.Item>
	<RadioGroup.Item value="m" disabled>Medium</RadioGroup.Item>
	<RadioGroup.Item value="l">
		<RadioGroup.Indicator data-testid="large-dot" />
		Large
	</RadioGroup.Item>
</RadioGroup.Root>
