let lastCloseAt = 0;

/**
 * Whether a tooltip may skip its open delay because another tooltip closed
 * recently. The timestamp is module-shared, so skip-delay works across
 * items without a provider component.
 */
export function shouldSkipDelay(now: number, skipDuration: number): boolean {
	return skipDuration > 0 && now - lastCloseAt < skipDuration;
}

export function markTooltipClosed(now: number = Date.now()): void {
	lastCloseAt = now;
}
