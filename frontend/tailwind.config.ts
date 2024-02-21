/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	mode: 'jit',
	purge: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				sans: ['Fredoka', 'sans-serif'],
			},
			fontSize: {
				'xs': '0.75rem',  // Extra Small
				'sm': '0.875rem', // Small
				'base': '1rem',   // Medium (Base)
				'lg': '1.125rem', // Large
				'xl': '1.25rem',  // Extra Large
				'2xl': '1.5rem',  // 2X Large
				'3xl': '1.875rem',  // 3X Large
				'4xl': '2.25rem',   // 4X Large
				'5xl': '3rem',      // 5X Large
			},
			colors: {
				customBlue: "#C1E2F7",
				customLightGreen: "#A0F4C7",
				customLightBlue: "#F1F8FD",
				customLightYellow: "#FFE6AF",
        		customDarkBlue: "#45A0E3",
        		customYellow: "#F5BC41",
				customGreen: "#14AE5C",
				textYellow: "#DA9501",
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		function ({ addUtilities }) {
			const newUtilities = {
				".shadow-drop": {
					boxShadow:
						"0px 0px 2px 0px rgba(69, 160, 227, 0.15), 0px 2px 5px 0px rgba(0, 0, 0, 0.05), 0px 8px 40px 0px rgba(0, 0, 0, 0.04)",
				},
			};
			addUtilities(newUtilities, {
				variants: ["responsive", "hover"],
			});
		},
	],
};