import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import pkg from "./package.json";
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit()
	],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version)
	}
});
