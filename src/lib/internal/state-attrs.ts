export interface CheckableState {
	checked: boolean;
	indeterminate?: boolean;
	disabled: boolean;
	readOnly: boolean;
	required: boolean;
}

/**
 * Shared `data-*` mapping for checkable primitives (Checkbox, Switch),
 * mirroring Base UI: exactly one of `data-checked` / `data-unchecked` /
 * `data-indeterminate` is present, plus optional state flags.
 */
export function getCheckableDataAttributes(state: CheckableState): Record<string, string> {
	const attrs: Record<string, string> = {};
	if (state.indeterminate) attrs['data-indeterminate'] = '';
	else if (state.checked) attrs['data-checked'] = '';
	else attrs['data-unchecked'] = '';
	if (state.disabled) attrs['data-disabled'] = '';
	if (state.readOnly) attrs['data-readonly'] = '';
	if (state.required) attrs['data-required'] = '';
	return attrs;
}
