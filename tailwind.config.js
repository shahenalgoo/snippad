const { createThemes } = require('tw-colors');

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
				// 'body': ['Helvetica', 'Arial', 'sans-serif'],
			},
			colors: {

				'danger': '#f43f5e',
				'success': '#4ade80',

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
	plugins: [
		createThemes({
			light: {
				'primary': '#34d399',
				'secondary': 'yellow',
				'text-default': '#000000',
				'background': '#f1f5f9',
				'border-default': '#e2e8f0',
			},
			dark: {
				'primary': '#34d399',
				'secondary': 'yellow',
				'text-default': '#ffffff',
				'background': '#18181b',
				'border-default': '#3f3f46',
			},
			coffee: {
				'primary': '#34d399',
				'secondary': 'yellow',
				'background': '#713f12',
				'border': '#e2e8f0',
			}
		})
	],
}
