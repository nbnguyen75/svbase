<script lang="ts">
	import { Button, Toast } from 'svbase';

	let count = $state(0);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<div class="flex flex-wrap items-center gap-3">
		<Button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
			onclick={() => {
				count += 1;
			}}
		>
			Show toast ({count} shown)
		</Button>
	</div>
	<Toast.Provider>
		<Toast.Viewport class="fixed right-4 bottom-4 z-50 flex w-96 flex-col gap-2">
			{#each Array(count) as _, index (index)}
				<Toast.Root class="rounded-lg border bg-card p-4 shadow-lg">
					<Toast.Title class="text-sm font-semibold">Saved ({index + 1})</Toast.Title>
					<Toast.Description class="text-sm text-muted-foreground">
						All changes saved.
					</Toast.Description>
					<div class="flex flex-wrap items-center gap-3">
						<Toast.Action
							class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
						>
							Undo
						</Toast.Action>
						<Toast.Close
							class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
						>
							Dismiss
						</Toast.Close>
					</div>
				</Toast.Root>
			{/each}
		</Toast.Viewport>
	</Toast.Provider>
	<p class="mt-3 text-sm text-muted-foreground">
		Hover a toast to pause its timer; swipe it sideways past 40px to dismiss.
	</p>
	<p class="mt-3 text-sm text-muted-foreground">
		Each toast is <code>role="status"</code> — screen readers announce it, no live region wiring needed.
	</p>
</div>
