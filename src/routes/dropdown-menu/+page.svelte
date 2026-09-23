<script lang="ts">
	import { DropdownMenu as Menu } from '$lib/index.js';

	let eatCount = $state(0);
</script>

<h1>Dropdown Menu</h1>
<p>Menu with roving focus, typeahead, checks, radios, and a submenu.</p>

<section>
	<Menu.Root>
		<Menu.Trigger>File</Menu.Trigger>
		<Menu.Portal>
			<Menu.Content>
				<Menu.Item
					onSelect={() => {
						eatCount += 1;
					}}
				>
					New
				</Menu.Item>
				<Menu.Item>Open</Menu.Item>
				<Menu.Item disabled>Save</Menu.Item>
				<Menu.Separator />
				<Menu.CheckboxItem>
					<Menu.CheckboxIndicator>✓</Menu.CheckboxIndicator>
					Show sidebar
				</Menu.CheckboxItem>
				<Menu.RadioGroup defaultValue="a">
					<Menu.RadioItem value="a">
						<Menu.RadioIndicator>●</Menu.RadioIndicator>
						Option A
					</Menu.RadioItem>
					<Menu.RadioItem value="b">
						<Menu.RadioIndicator>●</Menu.RadioIndicator>
						Option B
					</Menu.RadioItem>
				</Menu.RadioGroup>
				<Menu.SubRoot>
					<Menu.SubTrigger>Share</Menu.SubTrigger>
					<Menu.Portal>
						<Menu.Content>
							<Menu.Item>Email</Menu.Item>
							<Menu.Item>Copy link</Menu.Item>
						</Menu.Content>
					</Menu.Portal>
				</Menu.SubRoot>
			</Menu.Content>
		</Menu.Portal>
	</Menu.Root>
	<p>New clicked {eatCount}×. Type a letter to jump; arrows move; hover Share for the submenu.</p>
</section>
