<script lang="ts">
	import { Avatar } from '../../index.js';

	let brokenStatus = $state('idle');
	let loadedStatus = $state('idle');
</script>

<Avatar.Root>
	<Avatar.Image
		src="/nonexistent-avatar-xyz.png"
		alt="Broken avatar"
		onLoadingStatusChange={(status) => (brokenStatus = status)}
	/>
	<Avatar.Fallback>AB</Avatar.Fallback>
</Avatar.Root>
<p>Broken status: {brokenStatus}</p>

<Avatar.Root>
	<Avatar.Image
		src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
		alt="Loaded avatar"
		onLoadingStatusChange={(status) => (loadedStatus = status)}
	/>
	<Avatar.Fallback delayMs={60000}>CD</Avatar.Fallback>
</Avatar.Root>
<p>Loaded status: {loadedStatus}</p>
