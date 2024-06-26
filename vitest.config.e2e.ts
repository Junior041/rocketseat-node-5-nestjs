import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	test: {
		include:['**/*.e2e-spec.ts'],
		globals: true,
		root: './',
		exclude: ['node_modules', 'dist', 'data'],
		setupFiles: ['./test/setup.ts']
	},
	plugins: [ 
		tsConfigPaths(),
		swc.vite({
			module: {
				type: 'es6'
			}
		})]
});