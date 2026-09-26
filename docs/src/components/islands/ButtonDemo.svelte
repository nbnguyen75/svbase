<script lang="ts">
	import { Button } from 'svbase';

	let buttonClicks = $state(0);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<div class="flex flex-wrap items-center gap-3">
		<Button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
			onclick={() => (buttonClicks += 1)}
		>
			Clicked {buttonClicks}×
		</Button>
		<Button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			disabled
		>
			Disabled (not focusable)
		</Button>
		<Button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			disabled
			focusableWhenDisabled
		>
			Disabled but focusable
		</Button>
		<Button
			class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
			element="div"
		>
			Div as button (Tab to it, press Enter/Space)
		</Button>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">
		Inspect: native buttons carry `type="button"`; disabled ones carry `data-disabled`.
	</p>
</div>
