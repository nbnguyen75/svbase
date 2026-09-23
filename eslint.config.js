// @ts-check

import path from 'node:path';

import perfectionist from 'eslint-plugin-perfectionist';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import ts from 'typescript-eslint';

import { LINT_IGNORE_PATTERNS } from './shared-ignore.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: LINT_IGNORE_PATTERNS
	},
	svelte.configs.recommended,
	svelte.configs.prettier,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},
	{
		// Override or add rule settings here, such as:
		// 'svelte/button-has-type': 'error'
		rules: {}
	},
	{
		rules: {
			'perfectionist/sort-imports': [
				'warn',
				{
					customGroups: [
						{
							/* Svelte core */
							elementNamePattern: ['^svelte$', '^svelte/.*$', '^@sveltejs/.*$'],
							groupName: 'framework',
							modifiers: ['value']
						},
						{
							/* Actions — focus-trap, click-outside, portal... */
							elementNamePattern: '^\\$lib/actions/.*$',
							modifiers: ['value'],
							groupName: 'actions'
						},
						{
							/* Utils — clamp, debounce, merge-props... */
							elementNamePattern: '^\\$lib/utils/.*$',
							modifiers: ['value'],
							groupName: 'utils'
						},
						{
							/* Primitives — dialog, select state + parts */
							elementNamePattern: '^\\$lib/primitives/.*$',
							modifiers: ['value'],
							groupName: 'primitives'
						},
						{
							/* Positioning engine dependency */
							elementNamePattern: '^@floating-ui/.*$',
							modifiers: ['value'],
							groupName: 'positioning'
						},
						{
							/* CSS */
							elementNamePattern: '^.+\\.css$',
							modifiers: ['value'],
							groupName: 'assets'
						}
					],
					groups: [
						'type',
						'builtin',
						'framework',
						'external',
						'positioning',
						'primitives',
						'actions',
						'utils',
						'parent',
						'sibling',
						'index',
						'assets',
						'side-effect-style',
						'style',
						'import'
					]
				}
			],
			'perfectionist/sort-exports': ['warn', { type: 'line-length', order: 'desc' }],
			'perfectionist/sort-interfaces': ['warn', { type: 'line-length', order: 'desc' }],
			'perfectionist/sort-object-types': ['warn', { type: 'line-length', order: 'desc' }]
		},
		plugins: { perfectionist }
	}
);
