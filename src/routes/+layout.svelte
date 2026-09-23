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
		<a href={resolve('/switch')}>Switch</a>
	</nav>
</header>
<main>
	{@render children()}
</main>
