<script lang="ts">
	import { DropdownMenu as Menu } from '../../index.js';
</script>

<Menu.Root>
	<Menu.Trigger>File</Menu.Trigger>
	<Menu.Portal>
		<Menu.Content>
			<Menu.Item>New</Menu.Item>
			<Menu.Item>Open</Menu.Item>
			<Menu.Item disabled>Save</Menu.Item>
			<Menu.Separator />
			<Menu.CheckboxItem>
				<Menu.CheckboxIndicator data-testid="sidebar-dot" />
				Show sidebar
			</Menu.CheckboxItem>
			<Menu.RadioGroup defaultValue="a">
				<Menu.RadioItem value="a">
					<Menu.RadioIndicator data-testid="option-a-dot" />
					Option A
				</Menu.RadioItem>
				<Menu.RadioItem value="b">
					<Menu.RadioIndicator data-testid="option-b-dot" />
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
