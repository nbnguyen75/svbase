<script lang="ts">
	import { ToggleGroup } from '../../index.js';

	let single: string | null = $state(null);
	let multiple: Array<string> = $state([]);
</script>

<ToggleGroup.Root bind:value={single} name="align">
	<ToggleGroup.Item value="left">Left</ToggleGroup.Item>
	<ToggleGroup.Item value="center">Center</ToggleGroup.Item>
	<ToggleGroup.Item value="right" disabled>Right</ToggleGroup.Item>
</ToggleGroup.Root>
<p>Single: {single ?? '—'}</p>

<ToggleGroup.Root bind:value={multiple} multiple>
	<ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
	<ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
</ToggleGroup.Root>
<p>Multiple: {multiple.length ? multiple.join(',') : '—'}</p>
