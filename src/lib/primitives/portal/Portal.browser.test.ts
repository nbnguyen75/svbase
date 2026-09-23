import { expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { afterEach } from 'vitest';
import PortalFixture from './portal.fixture.svelte';

afterEach(() => cleanup());

test('teleports content to document.body', async () => {
	const screen = await render(PortalFixture);
	const node = await screen.getByTestId('teleported').findElement();
	const wrapper = node.parentElement;
	expect(wrapper).not.toBeNull();
	expect(wrapper?.parentElement).toBe(document.body);
});

test('unmount removes teleported content', async () => {
	const screen = await render(PortalFixture);
	await expect.element(screen.getByTestId('teleported')).toBeInTheDocument();
	await screen.unmount();
	expect(document.querySelector('[data-testid="teleported"]')).toBeNull();
});
