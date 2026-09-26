<script lang="ts">
	import { PreviewCard } from 'svbase';
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<PreviewCard.Root>
		<PreviewCard.Trigger
			class="cursor-pointer font-medium text-primary underline underline-offset-[3px]"
		>
			@ada
		</PreviewCard.Trigger>
		<PreviewCard.Portal>
			<PreviewCard.Content
				class="w-64 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md"
			>
				<p class="text-sm font-semibold">Ada Lovelace</p>
				<p class="mt-1 text-sm text-muted-foreground">First programmer. Hover away to dismiss.</p>
			</PreviewCard.Content>
		</PreviewCard.Portal>
	</PreviewCard.Root>
</div>
