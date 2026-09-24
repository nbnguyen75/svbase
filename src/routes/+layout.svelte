<script lang="ts">
	import type { Snippet } from 'svelte';

	import { resolve } from '$app/paths';

	interface LayoutProps {
		children: Snippet;
	}

	let { children }: LayoutProps = $props();
</script>

<header>
	<a href={resolve('/')}>svbase</a>
	<nav aria-label="Primitives">
		<a href={resolve('/button')}>Button</a>
		<a href={resolve('/toggle')}>Toggle</a>
		<a href={resolve('/checkbox')}>Checkbox</a>
		<a href={resolve('/radio-group')}>Radio Group</a>
		<a href={resolve('/collapsible')}>Collapsible</a>
		<a href={resolve('/accordion')}>Accordion</a>
		<a href={resolve('/dialog')}>Dialog</a>
		<a href={resolve('/alert-dialog')}>Alert Dialog</a>
		<a href={resolve('/popover')}>Popover</a>
		<a href={resolve('/tooltip')}>Tooltip</a>
		<a href={resolve('/dropdown-menu')}>Dropdown Menu</a>
		<a href={resolve('/tabs')}>Tabs</a>
		<a href={resolve('/slider')}>Slider</a>
		<a href={resolve('/progress')}>Progress</a>
		<a href={resolve('/select')}>Select</a>
		<a href={resolve('/separator')}>Separator</a>
		<a href={resolve('/scroll-area')}>Scroll Area</a>
		<a href={resolve('/switch')}>Switch</a>
	</nav>
</header>
<main>
	{@render children()}
</main>
