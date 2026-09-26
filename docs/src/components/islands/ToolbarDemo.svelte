<script lang="ts">
	import { Toolbar } from 'svbase';

	let saved = $state(0);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Toolbar.Root>
		<div class="flex items-center gap-1">
			<Toolbar.Button
				class="rounded-md px-3 py-1.5 text-sm hover:bg-accent"
				onclick={() => (saved += 1)}
			>
				Save
			</Toolbar.Button>
			<Toolbar.Button class="rounded-md px-3 py-1.5 text-sm hover:bg-accent" disabled>
				Cut
			</Toolbar.Button>
			<Toolbar.Separator class="mx-1 h-5 border-l" />
			<Toolbar.Link href="https://example.com" class="rounded-md px-3 py-1.5 text-sm hover:bg-accent">
				Help
			</Toolbar.Link>
			<Toolbar.Input
				aria-label="Search"
				placeholder="Search"
				class="h-9 rounded-md border bg-transparent px-3 text-sm"
			/>
		</div>
	</Toolbar.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Saved: {saved} (Tab in once, arrows travel — Cut is skipped)
	</p>
</div>
