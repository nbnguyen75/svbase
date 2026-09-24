import { describe, expect, test } from 'vitest';
import { getTabIds } from './context.js';

describe('getTabIds', () => {
	test('derives stable linked ids', () => {
		expect(getTabIds('tabs-1', 'overview')).toEqual({
			tabId: 'tabs-1-tab-overview',
			panelId: 'tabs-1-panel-overview'
		});
	});

	test('sanitizes unsafe characters', () => {
		const { tabId, panelId } = getTabIds('root', 'my tab!');
		expect(tabId).toBe('root-tab-my-tab-');
		expect(panelId).toBe('root-panel-my-tab-');
	});
});
