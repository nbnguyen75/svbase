import {
	arrow as arrowMiddleware,
	computePosition,
	type Middleware,
	type Placement,
	type Strategy,
	autoUpdate,
	offset,
	shift,
	flip
} from '@floating-ui/dom';

export type { Middleware, Placement, Strategy };

export interface FloatingPositionOptions {
	/** Preferred placement; floating-ui may flip it on collision. @default 'bottom' */
	placement?: Placement;
	/** Viewport padding for the shift middleware, in pixels. @default 8 */
	shiftPadding?: number;
	/** CSS position strategy. @default 'absolute' */
	strategy?: Strategy;
	/** Gap between anchor and floating element, in pixels. @default 0 */
	offset?: number;
	/** Flip to the opposite side on collision. @default true */
	flip?: boolean;
}

/**
 * Shared anchor-positioning controller for floating primitives (popover,
 * tooltip, and later select/menu). Thin Svelte-native shell around
 * `@floating-ui/dom` — the engine answers "where", all behavior (open
 * state, delays, dismissal, focus) stays in the primitives.
 *
 * Design notes:
 * - No `$effect` inside: node capture happens in the attachment closures
 *   (which already run in an effect), and option changes flow through
 *   `update()`. Plain fields in, `$state` out — no update loops possible,
 *   SSR-safe (attachments never run server-side), and constructible in
 *   plain Node unit tests.
 * - Styles are applied directly to the floating element; `positioned`
 *   gates visibility so the first paint never flashes at the origin.
 * - Arrow centering (`left`/`top`) is applied when the middleware reports
 *   it; pushing the arrow onto the edge stays consumer CSS (it depends on
 *   the arrow's own size).
 */
export class FloatingPosition {
	x = $state(0);
	y = $state(0);
	placement = $state<Placement>('bottom');
	positioned = $state(false);
	arrowX = $state<number | undefined>(undefined);
	arrowY = $state<number | undefined>(undefined);

	#reference: HTMLElement | undefined = undefined;
	#floating: HTMLElement | undefined = undefined;
	#arrow: HTMLElement | undefined = undefined;
	#stopAutoUpdate: (() => void) | undefined = undefined;

	#placement: Placement;
	#strategy: Strategy;
	#offset: number;
	#flip: boolean;
	#shiftPadding: number;

	constructor(options: FloatingPositionOptions = {}) {
		this.#placement = options.placement ?? 'bottom';
		this.#strategy = options.strategy ?? 'absolute';
		this.#offset = options.offset ?? 0;
		this.#flip = options.flip ?? true;
		this.#shiftPadding = options.shiftPadding ?? 8;
	}

	update(options: FloatingPositionOptions): void {
		if (options.placement !== undefined) this.#placement = options.placement;
		if (options.strategy !== undefined) this.#strategy = options.strategy;
		if (options.offset !== undefined) this.#offset = options.offset;
		if (options.flip !== undefined) this.#flip = options.flip;
		if (options.shiftPadding !== undefined) this.#shiftPadding = options.shiftPadding;
		this.#sync();
	}

	/** Attach to the anchor element. */
	reference = (node: HTMLElement): (() => void) => {
		this.#reference = node;
		this.#sync();
		return () => {
			if (this.#reference === node) {
				this.#reference = undefined;
				this.#sync();
			}
		};
	};

	/** Attach to the floating element. */
	floating = (node: HTMLElement): (() => void) => {
		this.#floating = node;
		this.#sync();
		return () => {
			if (this.#floating === node) {
				this.#floating = undefined;
				this.#sync();
			}
		};
	};

	/** Attach to the arrow element. */
	arrow = (node: HTMLElement): (() => void) => {
		this.#arrow = node;
		this.#sync();
		return () => {
			if (this.#arrow === node) {
				this.#arrow = undefined;
				this.#sync();
			}
		};
	};

	#sync(): void {
		this.#stopAutoUpdate?.();
		this.#stopAutoUpdate = undefined;
		const reference = this.#reference;
		const floating = this.#floating;
		if (!reference || !floating) {
			this.positioned = false;
			return;
		}
		this.#stopAutoUpdate = autoUpdate(reference, floating, () => void this.#compute());
	}

	async #compute(): Promise<void> {
		const reference = this.#reference;
		const floating = this.#floating;
		const arrowElement = this.#arrow;
		if (!reference || !floating) return;
		const middleware: Array<Middleware> = [offset(this.#offset)];
		if (this.#flip) middleware.push(flip());
		middleware.push(shift({ padding: this.#shiftPadding }));
		if (arrowElement) middleware.push(arrowMiddleware({ element: arrowElement }));
		const { x, y, placement, middlewareData } = await computePosition(reference, floating, {
			placement: this.#placement,
			strategy: this.#strategy,
			middleware
		});
		// Stale flight: nodes changed while awaiting.
		if (this.#reference !== reference || this.#floating !== floating) return;
		floating.style.position = this.#strategy;
		floating.style.left = `${x}px`;
		floating.style.top = `${y}px`;
		if (arrowElement && this.#arrow === arrowElement) {
			const arrowX = middlewareData.arrow?.x;
			const arrowY = middlewareData.arrow?.y;
			if (arrowX === undefined) arrowElement.style.removeProperty('left');
			else arrowElement.style.left = `${arrowX}px`;
			if (arrowY === undefined) arrowElement.style.removeProperty('top');
			else arrowElement.style.top = `${arrowY}px`;
		}
		this.x = x;
		this.y = y;
		this.placement = placement;
		this.arrowX = middlewareData.arrow?.x;
		this.arrowY = middlewareData.arrow?.y;
		this.positioned = true;
	}
}
