<script lang="ts" module>
	export interface ApiProp {
		defaultValue?: string;
		description: string;
		name: string;
		type: string;
	}
</script>

<script lang="ts">
	import { cn } from 'cn';

	interface Props {
		props: Array<ApiProp>;
		class?: string;
	}

	let { props, class: className = '' }: Props = $props();
</script>

<div class={cn('overflow-x-auto rounded-lg border', className)}>
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b bg-muted/50 text-left">
				<th class="px-4 py-2 font-medium">Prop</th>
				<th class="px-4 py-2 font-medium">Type</th>
				<th class="px-4 py-2 font-medium">Default</th>
				<th class="px-4 py-2 font-medium">Description</th>
			</tr>
		</thead>
		<tbody>
			{#each props as prop (prop.name)}
				<tr class="border-b align-top last:border-0">
					<td class="px-4 py-2 font-mono text-[13px] whitespace-nowrap">{prop.name}</td>
					<td class="px-4 py-2 font-mono text-[13px] text-muted-foreground">{prop.type}</td>
					<td class="px-4 py-2 font-mono text-[13px] text-muted-foreground">
						{prop.defaultValue ?? '—'}
					</td>
					<td class="px-4 py-2 text-muted-foreground">{prop.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
