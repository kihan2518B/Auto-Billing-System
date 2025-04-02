/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				// Existing Colors from Your Config
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				navy: {
					500: '#1E3A8A', // Primary button focus
					600: '#1E40AF', // Primary button
					700: '#1E3A8A', // Primary button hover
					800: '#1E2A78', // Headings
					900: '#172554', // Text
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},

				// New Colors from the Enhanced Palette
				// Overriding 'primary' with specific values instead of HSL variables
				primary: {
					DEFAULT: '#4F46E5', // Indigo-600
					hover: '#4338CA',   // Indigo-700
					disabled: '#818CF8', // Indigo-400
					ring: '#6366F1',    // Indigo-500 (focus ring)
				},
				neutral: {
					white: '#FFFFFF',   // White
					light: '#F9FAFB',   // Gray-50
					border: '#D1D5DB',  // Gray-300
					text: '#374151',    // Gray-700
					heading: '#1F2A44', // Gray-800
					disabled: '#D1D5DB', // Gray-300 (disabled input bg)
				},
				accent: {
					red: '#DC2626',     // Red-600
					'red-hover': '#B91C1C', // Red-800
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			// Optional: Add custom spacing or typography from the new palette
			spacing: {
				'18': '4.5rem',
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};

export default config;