type Handler<T extends Event> = ((event: T) => void) | undefined | null | false;

/**
 * Composes multiple event handlers into one. Handlers run in the order given —
 * pass the consumer's handler first so it can cancel internal behavior via
 * `event.preventDefault()`, the DOM-native equivalent of Base UI's
 * `preventBaseUIHandler()`.
 */
export function composeHandlers<T extends Event>(
	...handlers: Array<Handler<T>>
): (event: T) => void {
	return (event: T) => {
		for (const handler of handlers) {
			if (typeof handler === 'function') {
				handler(event);
				if (event.defaultPrevented) break;
			}
		}
	};
}
