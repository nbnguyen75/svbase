<script lang="ts" module>
	import type { FieldValidationMode } from './context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type { FieldValidationMode };

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		/**
		 * Custom validator run after native constraints pass.
		 * Return an error message string, or null when the value is valid.
		 * Sync only — async validators are out of scope for v1.
		 */
		validate?: ((value: unknown, formValues: Record<string, string>) => string | null) | undefined;
		/** When validation runs. Overrides the enclosing Form's mode. @default 'onBlur' */
		validationMode?: FieldValidationMode | undefined;
		ref?: HTMLElement | undefined;
		/** External invalid flag (e.g. server errors). Keeps the field invalid while set. */
		invalid?: boolean | undefined;
		/** Form field name. Falls back to the control's own name when omitted. */
		name?: string | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored. Inherits fieldset disabled state. @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { optionalContext } from '../../utils/context.js';
	import { createId } from '../../utils/id.js';
	import { getFieldsetState } from '../fieldset/context.js';
	import { getFormState } from '../form/context.js';

	import { type FieldControlHandle, setFieldState } from './context.js';

	let {
		name = undefined,
		disabled = false,
		invalid = undefined,
		validate = undefined,
		validationMode = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	const fieldset = optionalContext(getFieldsetState);
	const form = optionalContext(getFormState);

	const disabledEff = $derived(disabled || fieldset?.disabled === true);
	const mode = $derived(validationMode ?? form?.validationMode ?? 'onBlur');

	const controlId = createId('field');
	const descriptionId = `${controlId}-description`;
	const errorId = `${controlId}-error`;

	let valid = $state<boolean | null>(null);
	let dirty = $state(false);
	let touched = $state(false);
	let filled = $state(false);
	let focused = $state(false);
	let error = $state('');
	let hasDescription = $state(false);
	let hasErrorPart = $state(false);
	let submitted = $state(false);
	let control = $state<FieldControlHandle | null>(null);
	// The custom message currently installed on the control (if any), so
	// revalidation never reads our own message back as a native constraint.
	let ownedMessage: string | null = null;

	const showInvalid = $derived(invalid === true || valid === false);

	function currentValue(): unknown {
		return control?.getValue() ?? null;
	}

	function syncFilled(): void {
		const value = currentValue();
		filled = value !== '' && value !== null && value !== undefined;
	}

	function shouldValidateOnChange(): boolean {
		return mode === 'onChange' || (mode === 'onSubmit' && submitted);
	}

	function runValidation(source: 'change' | 'blur' | 'submit'): boolean {
		if (source === 'change' && !shouldValidateOnChange() && valid !== false) {
			return true;
		}
		if (disabledEff && invalid !== true) {
			return valid !== false;
		}
		const el = control?.element() ?? null;
		const value = currentValue();
		// Never read our own previously-installed message back as a native constraint.
		if (el && el.validity.customError && el.validationMessage === ownedMessage) {
			el.setCustomValidity('');
			ownedMessage = null;
		}
		let nativeValid = true;
		let nativeMessage = '';
		if (el && el.willValidate) {
			const v = el.validity;
			const otherErrors =
				v.badInput ||
				v.customError ||
				v.patternMismatch ||
				v.rangeOverflow ||
				v.rangeUnderflow ||
				v.stepMismatch ||
				v.tooLong ||
				v.tooShort ||
				v.typeMismatch;
			// Suppress valueMissing noise until the user has changed the value.
			// Submit always counts it — an untouched required field must block.
			if (!(v.valueMissing && !dirty && !otherErrors && source !== 'submit')) {
				nativeValid = v.valid;
				nativeMessage = el.validationMessage;
			}
		}
		const formValues = form?.getValues() ?? {};
		const custom = validate?.(value, formValues) ?? null;
		const ok = nativeValid && (custom === null || custom === '');
		error = !ok ? custom || nativeMessage : '';
		valid = ok;
		if (el) {
			if (!ok && custom) {
				el.setCustomValidity(custom);
				ownedMessage = custom;
			} else if (el.validity.customError && el.validationMessage === ownedMessage) {
				el.setCustomValidity('');
				ownedMessage = null;
			}
		}
		return ok;
	}

	function getDescribedBy(): string | undefined {
		const ids: Array<string> = [];
		if (hasDescription) ids.push(descriptionId);
		if (showInvalid && hasErrorPart) ids.push(errorId);
		return ids.length > 0 ? ids.join(' ') : undefined;
	}

	function focusControl(): void {
		control?.element()?.focus();
	}

	function resetField(): void {
		dirty = false;
		touched = false;
		valid = null;
		error = '';
		submitted = false;
		const el = control?.element() ?? null;
		el?.setCustomValidity('');
		ownedMessage = null;
		// Native reset restores input values after the reset event dispatch.
		queueMicrotask(() => syncFilled());
	}

	setFieldState({
		get controlId() {
			return controlId;
		},
		get descriptionId() {
			return descriptionId;
		},
		get errorId() {
			return errorId;
		},
		get name() {
			return name;
		},
		get disabled() {
			return disabledEff;
		},
		get valid() {
			return showInvalid ? false : valid;
		},
		get dirty() {
			return dirty;
		},
		get touched() {
			return touched;
		},
		get filled() {
			return filled;
		},
		get focused() {
			return focused;
		},
		get error() {
			return error;
		},
		registerControl(next: FieldControlHandle) {
			control = next;
			syncFilled();
		},
		unregisterControl() {
			control = null;
		},
		setHasDescription(present: boolean) {
			hasDescription = present;
		},
		setHasError(present: boolean) {
			hasErrorPart = present;
		},
		getDescribedBy,
		handleChange() {
			dirty = true;
			syncFilled();
			runValidation('change');
		},
		handleBlur() {
			touched = true;
			focused = false;
			runValidation('blur');
		},
		handleFocus() {
			focused = true;
		},
		validate: (source) => runValidation(source),
		markSubmitted() {
			submitted = true;
		},
		focusControl,
		resetField
	});

	const dataAttrs = $derived({
		...(showInvalid ? { 'data-invalid': '' } : valid === true ? { 'data-valid': '' } : {}),
		...(dirty ? { 'data-dirty': '' } : {}),
		...(touched ? { 'data-touched': '' } : {}),
		...(filled ? { 'data-filled': '' } : {}),
		...(focused ? { 'data-focused': '' } : {}),
		...(disabledEff ? { 'data-disabled': '' } : {})
	});

	onMount(() => {
		if (!form) return;
		const registration = {
			get id() {
				return controlId;
			},
			get name() {
				return name;
			},
			validate: () => runValidation('submit'),
			getErrors: () => (showInvalid && error ? [error] : []),
			focus: focusControl,
			reset: resetField,
			markSubmitted() {
				submitted = true;
			}
		};
		form.registerField(registration);
		return () => form.unregisterField(controlId);
	});
</script>

<div {...rest} bind:this={ref} {...dataAttrs}>
	{@render children?.()}
</div>
