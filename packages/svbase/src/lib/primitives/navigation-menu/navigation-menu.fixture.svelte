<script lang="ts">
	import { NavigationMenu } from '../../index.js';
	let picked: string | null = $state(null);
</script>

<NavigationMenu.Root>
	<NavigationMenu.Item value="products">
		<NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
		<NavigationMenu.Content>
			<NavigationMenu.MenuItem onSelect={() => (picked = 'overview')}
				>Overview</NavigationMenu.MenuItem
			>
			<NavigationMenu.MenuItem onSelect={() => (picked = 'pricing')}
				>Pricing</NavigationMenu.MenuItem
			>
		</NavigationMenu.Content>
	</NavigationMenu.Item>
	<NavigationMenu.Item value="company">
		<NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
		<NavigationMenu.Content>
			<NavigationMenu.MenuItem onSelect={() => (picked = 'about')}>About</NavigationMenu.MenuItem>
		</NavigationMenu.Content>
	</NavigationMenu.Item>
	<NavigationMenu.Link href="/blog">Blog</NavigationMenu.Link></NavigationMenu.Root
>
<p>Picked: {picked ?? '—'}</p>
