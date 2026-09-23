<script lang="ts" module>
	export interface HiddenInputProps {
		/** Fired when the input toggles natively (e.g. via an associated label). */
		onNativeChange?: ((checked: boolean) => void) | undefined;
		inputRef?: HTMLInputElement | undefined;
		/** Native input kind: checkbox state or radio-group membership. @default 'checkbox' */
		type?: 'checkbox' | 'radio' | undefined;
		/** Synced onto the input's `indeterminate` DOM property. */
		indeterminate?: boolean | undefined;
		/** Submitted value when unchecked (nothing submitted when omitted). */
		uncheckedValue?: string | undefined;
		disabled?: boolean | undefined;
		readOnly?: boolean | undefined;
		required?: boolean | undefined;
		/** Submitted value when checked (native `"on"` when omitted). */
		value?: string | undefined;
		/** Form field name. Omit to exclude from submission. */
		name?: string | undefined;
		form?: string | undefined;
		/** Applied to the input for native `<label for>` association. */
		id?: string | undefined;
		/** Current ticked state, mirrored onto the native input. */
		checked: boolean;
	}

	/**
	 * Functional hiding only (keeps the input focusable-by-label,
	 * validatable, and submittable) — not a styling opinion.
	 */
	const VISUALLY_HIDDEN =
		'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;';
</script>

<script lang="ts">
	let {
		checked,
		type = 'checkbox',
		indeterminate = false,
		disabled = false,
		readOnly = false,
		name = undefined,
		value = undefined,
		uncheckedValue = undefined,
		form = undefined,
		required = false,
		id = undefined,
		inputRef = $bindable<HTMLInputElement | undefined>(undefined),
		onNativeChange = undefined
	}: HiddenInputProps = $props();

	function handleChange(event: Event): void {
		const input = event.currentTarget;
		if (!(input instanceof HTMLInputElement)) return;
		if (disabled || readOnly) {
			// State is owned by the root: revert the native toggle.
			input.checked = checked;
			input.indeterminate = indeterminate;
			return;
		}
		onNativeChange?.(input.checked);
	}

	// `indeterminate` is a DOM property with no attribute equivalent.
	$effect(() => {
		if (inputRef) inputRef.indeterminate = indeterminate;
	});
</script>

<input
	bind:this={inputRef}
	{type}
	{id}
	{name}
	{value}
	{form}
	{required}
	disabled={disabled ? true : undefined}
	checked={checked ? true : undefined}
	tabindex={-1}
	aria-hidden="true"
	style={VISUALLY_HIDDEN}
	onchange={handleChange}
/>
{#if !checked && name && uncheckedValue !== undefined}
	<input
		type="hidden"
		{form}
		{name}
		value={uncheckedValue}
		disabled={disabled ? true : undefined}
	/>
{/if}
