type ClassValue = string | false | null | undefined;

/**
 * Docs-only class joiner (routes use it to compose Tailwind utilities).
 * Deliberately NOT clsx + tailwind-merge: docs call sites are controlled
 * and never need conflict resolution. Never import this from `src/lib`.
 */
export function cn(...inputs: Array<ClassValue>): string {
	return inputs
		.filter((input): input is string => typeof input === 'string' && input !== '')
		.join(' ');
}
