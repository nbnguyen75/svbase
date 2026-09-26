<script lang="ts">
	import { PreviewCard } from '../../index.js';
</script>

<PreviewCard.Root delay={10} closeDelay={10}>
	<PreviewCard.Trigger>@ada</PreviewCard.Trigger>
	<PreviewCard.Portal>
		<PreviewCard.Content aria-label="Ada profile">
			<p>Ada Lovelace — first programmer.</p>
		</PreviewCard.Content>
	</PreviewCard.Portal>
</PreviewCard.Root>
<p>Below the card</p>
