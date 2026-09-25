import { createPrimitiveContext } from '../../utils/context.js';

export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarState {
	readonly status: AvatarImageStatus;
	setStatus(status: AvatarImageStatus): void;
}

export const [getAvatarState, setAvatarState] = createPrimitiveContext<AvatarState>('Avatar');
