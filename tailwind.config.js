/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Noto Sans', 'system-ui'],
				'body': ['Roboto Slab', 'Arial', 'sans-serif'],
			},
			colors: {
				'primary': '#2dd4bf',
				'danger': '#fb7185',
				'success': '#4ade80',
				'border-light': '#e2e8f0',
				'border-dark': '#262626',
				// 'border-light': 'red'

				// Star snippets/notes
				'star': '#f59e0b',

				// P Languages
				'html': '#e34c26',
				'css': '#264de4',
				'js': '#ca8a04',
				'ts': '#007acc',
				'py': '#4b8bbe',
				'php': '#474a8a',
				'cs': '#682876',
				'cpp': '#00549d',
				'java': '#1565c0',
				'json': '#000',
				'kt': '#c757bc',
				'sql': '#512da8',

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
