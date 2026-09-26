import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://svbase.dev',
	adapter: vercel(),
	integrations: [
		starlight({
			title: 'svbase',
			description: 'Unstyled, headless UI primitives for Svelte 5.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/nbnguyen75/svbase' }],
			editLink: { baseUrl: 'https://github.com/nbnguyen75/svbase/edit/main/docs/' },
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{ label: 'Overview', slug: 'index' },
				{
					label: 'Primitives',
					items: [
						'accordion',
						'alert-dialog',
						'avatar',
						'button',
						'checkbox',
						'checkbox-group',
						'collapsible',
						'combobox',
						'context-menu',
						'dialog',
						'direction',
						'drawer',
						'dropdown-menu',
						'form',
						'menubar',
						'meter',
						'navigation-menu',
						'number-field',
						'otp-field',
						'popover',
						'preview-card',
						'progress',
						'radio-group',
						'scroll-area',
						'select',
						'separator',
						'slider',
						'switch',
						'tabs',
						'toast',
						'toggle',
						'toggle-group',
						'toolbar',
						'tooltip'
					]
				}
			]
		}),
		mdx(),
		svelte()
	],
	vite: {
		plugins: [tailwindcss()]
	}
});
