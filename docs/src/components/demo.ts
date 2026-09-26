/**
 * Shared shadcn-style dressing for docs demo islands.
 * Token utilities (`bg-card`, `border-input`, …) come from `custom.css`.
 * State hooks mirror the library's `data-*` contract (`state-attrs.ts`,
 * `data-state="open|closed|active|inactive"`, `data-highlighted`, `data-pressed`).
 */
export const card = 'mt-4 rounded-xl border bg-card p-6 text-card-foreground';
export const hint = 'mt-3 text-sm text-muted-foreground';
export const row = 'flex flex-wrap items-center gap-3';
export const label = 'flex cursor-pointer items-center gap-2 text-sm';
export const btn =
	'inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent';
export const btnPrimary =
	'inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110';
export const input = 'h-9 rounded-md border bg-transparent px-3 text-sm';
export const menuContent =
	'min-w-48 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md';
export const menuItem = 'rounded px-2 py-1.5 text-sm data-highlighted:bg-accent';
export const menuSeparator = 'my-1 border-t';
export const accordionItem = 'border-b last:border-b-0';
export const disclosureTrigger =
	'group flex w-full items-center justify-between gap-2 py-4 text-left text-sm font-medium transition-colors hover:text-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50';
export const chevron =
	'size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180';
export const disclosurePanel = 'overflow-hidden text-sm text-muted-foreground';
export const disclosurePanelInner = 'pb-4 pt-0';
export const switchTrack =
	'inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-input px-0.5 transition-colors data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50';
export const switchThumb =
	'block size-5 rounded-full bg-background shadow transition-transform data-checked:translate-x-5';
export const checkBox =
	'grid size-4 shrink-0 place-items-center rounded border border-input text-transparent shadow transition-colors data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50';
export const checkMark = 'size-3';
export const groupRow =
	'inline-flex cursor-pointer items-center gap-2 text-sm data-disabled:cursor-not-allowed data-disabled:opacity-50';
/** The checkbox-group box renders internally on check only — dress it when present. */
export const groupBox =
	'[&>span]:grid [&>span]:size-4 [&>span]:shrink-0 [&>span]:place-items-center [&>span]:rounded [&>span]:border [&>span]:border-input [&>span]:text-transparent [&>span]:shadow [&>span]:transition-colors [&>span]:data-checked:border-primary [&>span]:data-checked:bg-primary [&>span]:data-checked:text-primary-foreground';
export const tabsList = 'inline-flex h-9 items-center gap-1 rounded-lg bg-muted p-1';
export const tabsTrigger =
	'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow';
export const tooltipContent =
	'rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md';
export const sliderThumb =
	'block size-4 rounded-full border border-primary bg-background shadow transition-colors';
