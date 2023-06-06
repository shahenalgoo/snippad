/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Noto Sans', 'system-ui'],
				'body': ['Roboto Slab', 'Arial', 'sans-serif'],
			},
			colors: {
				'primary': '#34d399',
				'danger': '#f43f5e',
				'success': '#4ade80',
				'border-light': '#e2e8f0',
				// 'border-light': 'red'
				'star': '#f59e0b',
				'html': '#e34c26',
				'css': '#264de4',
				'js': '#ca8a04',
				'ts': '#007acc'
			},
			container: {
				center: true,
				padding: {
					DEFAULT: '1.2rem',
					sm: '2rem',
					md: '2rem',
					lg: '2rem',
					xl: '4rem'
				}
			},
		},
	},
	plugins: [],
}
