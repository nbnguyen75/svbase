<script lang="ts">
	import { Button } from '$lib/index.js';

	let buttonClicks = $state(0);
</script>

<h1>Button</h1>
<p>Unstyled button with disabled handling and element delegation.</p>

<section>
	<Button onclick={() => (buttonClicks += 1)}>Clicked {buttonClicks}×</Button>
	<Button disabled>Disabled (not focusable)</Button>
	<Button disabled focusableWhenDisabled>Disabled but focusable</Button>
	<Button element="div">Div as button (Tab to it, press Enter/Space)</Button>
	<p>
		Inspect: native buttons carry <code>type="button"</code>; disabled ones carry
		<code>data-disabled</code>.
	</p>
</section>
