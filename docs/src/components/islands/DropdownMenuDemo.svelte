<script lang="ts">
	import { DropdownMenu as Menu } from 'svbase';

	let eatCount = $state(0);
</script>

<div class="mt-4 rounded-xl border bg-card p-6 text-card-foreground">
	<Menu.Root>
		<Menu.Trigger>File</Menu.Trigger>
		<Menu.Portal>
			<Menu.Content
				class="min-w-48 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
			>
				<Menu.Item
					class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					onSelect={() => {
						eatCount += 1;
					}}
				>
					New
				</Menu.Item>
				<Menu.Item class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">Open</Menu.Item>
				<Menu.Item disabled class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
					Save
				</Menu.Item>
				<Menu.Separator class="my-1 border-t" />
				<Menu.CheckboxItem class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
					<Menu.CheckboxIndicator>✓</Menu.CheckboxIndicator>
					Show sidebar
				</Menu.CheckboxItem>
				<Menu.RadioGroup defaultValue="a">
					<Menu.RadioItem
						value="a"
						class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					>
						<Menu.RadioIndicator>●</Menu.RadioIndicator>
						Option A
					</Menu.RadioItem>
					<Menu.RadioItem
						value="b"
						class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent"
					>
						<Menu.RadioIndicator>●</Menu.RadioIndicator>
						Option B
					</Menu.RadioItem>
				</Menu.RadioGroup>
				<Menu.SubRoot>
					<Menu.SubTrigger class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
						Share
					</Menu.SubTrigger>
					<Menu.Portal>
						<Menu.Content class="min-w-40 rounded-lg border bg-popover p-1 shadow-md">
							<Menu.Item class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
								Email
							</Menu.Item>
							<Menu.Item class="rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">
								Copy link
							</Menu.Item>
						</Menu.Content>
					</Menu.Portal>
				</Menu.SubRoot>
			</Menu.Content>
		</Menu.Portal>
	</Menu.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		New clicked {eatCount}×. Type a letter to jump; arrows move; hover Share for the submenu.
	</p>
</div>
