<script lang="ts">
	import { NavigationMenu } from 'svbase';

	let picked: string | null = $state(null);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<NavigationMenu.Root>
		<NavigationMenu.Item value="products">
			<NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
			<NavigationMenu.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
				<NavigationMenu.MenuItem
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					onSelect={() => (picked = 'overview')}
				>
					Overview
				</NavigationMenu.MenuItem>
				<NavigationMenu.MenuItem
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					onSelect={() => (picked = 'pricing')}
				>
					Pricing
				</NavigationMenu.MenuItem>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item value="company">
			<NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
			<NavigationMenu.Content class="min-w-48 rounded-lg border bg-popover p-1 shadow-md">
				<NavigationMenu.MenuItem
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					onSelect={() => (picked = 'about')}
				>
					About
				</NavigationMenu.MenuItem>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Link
			href="/blog"
			class="rounded px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
		>
			Blog
		</NavigationMenu.Link>
	</NavigationMenu.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Picked: {picked ?? '—'} (hover the triggers, or Tab in and use arrows)
	</p>
</div>
