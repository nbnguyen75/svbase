<script lang="ts">
	import { Avatar } from 'svbase';

	let status = $state('idle');
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<div class="flex flex-wrap items-center gap-6">
		<Avatar.Root>
			<Avatar.Image
				src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23ff3e00'/%3E%3Ctext x='32' y='42' font-size='28' text-anchor='middle' fill='white'%3ESV%3C/text%3E%3C/rect%3E%3C/svg%3E"
				alt="SV logo"
				class="h-16 w-16 rounded-full"
				onLoadingStatusChange={(next) => (status = next)}
			/>
			<Avatar.Fallback
				class="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold"
			>
				SV
			</Avatar.Fallback>
		</Avatar.Root>
		<Avatar.Root>
			<Avatar.Image
				src="/nonexistent-avatar-docs.png"
				alt="Missing person"
				class="h-16 w-16 rounded-full"
			/>
			<Avatar.Fallback
				class="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold"
			>
				MP
			</Avatar.Fallback>
		</Avatar.Root>
	</div>
	<p class="mt-3 text-sm text-muted-foreground">
		First avatar status: {status} (loads instantly from a data URL; the second always falls back).
	</p>
</div>
