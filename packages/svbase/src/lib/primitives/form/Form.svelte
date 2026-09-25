<script lang="ts" module>
	import type { FormValidationMode } from './context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	export type { FormValidationMode };

	export interface FormProps extends Omit<HTMLFormAttributes, 'children'> {
		/**
		 * Called on every submit with the native form values and per-field errors.
		 * Native submission is always prevented — handle navigation/saving here.
		 */
		onFormSubmit?:
			| ((values: Record<string, string>, errors: Record<string, Array<string>>) => void)
			| undefined;
		/** Default validation mode for nested fields. A field's own mode wins. @default 'onSubmit' */
		validationMode?: FormValidationMode | undefined;
		ref?: HTMLFormElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { type FormFieldRegistration, setFormState } from './context.js';

	let {
		onFormSubmit = undefined,
		validationMode = 'onSubmit',
		ref = $bindable<HTMLFormElement | undefined>(undefined),
		children,
		...rest
	}: FormProps = $props();

	let fields = $state<Array<FormFieldRegistration>>([]);

	setFormState({
		get validationMode() {
			return validationMode;
		},
		registerField(field: FormFieldRegistration) {
			fields = [...fields, field];
		},
		unregisterField(id: string) {
			fields = fields.filter((field) => field.id !== id);
		},
		markAllSubmitted() {
			for (const field of fields) field.markSubmitted();
		},
		getValues() {
			if (!ref) return {};
			const data = new FormData(ref);
			return Object.fromEntries(Array.from(data, ([key, value]) => [key, String(value)] as const));
		}
	});

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		if (!ref) return;
		for (const field of fields) field.markSubmitted();
		const errors: Record<string, Array<string>> = {};
		let firstInvalid: FormFieldRegistration | null = null;
		for (const field of fields) {
			const ok = field.validate();
			if (!ok) {
				const fieldErrors = field.getErrors();
				if (fieldErrors.length > 0) errors[field.name ?? field.id] = fieldErrors;
				firstInvalid ??= field;
			}
		}
		if (firstInvalid) firstInvalid.focus();
		const values: Record<string, string> = Object.fromEntries(
			Array.from(new FormData(ref), ([key, value]) => [key, String(value)] as const)
		);
		onFormSubmit?.(values, errors);
	}

	function handleReset(): void {
		for (const field of fields) field.reset();
	}

	// `reset` does not bubble, so Svelte's delegated `onreset` never fires —
	// attach directly to the form element instead (consumer handler included).
	onMount(() => {
		const form = ref;
		if (!form) return;
		const handleResetEvent = (event: Event): void => {
			const consumer = rest.onreset;
			if (typeof consumer === 'function') {
				consumer(event as Event & { currentTarget: EventTarget & HTMLFormElement });
			}
			handleReset();
		};
		form.addEventListener('reset', handleResetEvent);
		return () => form.removeEventListener('reset', handleResetEvent);
	});
</script>

<form {...rest} bind:this={ref} novalidate onsubmit={composeHandlers(rest.onsubmit, handleSubmit)}>
	{@render children?.()}
</form>
