/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Light, e-commerce-store canvas (matches reference screenshot)
          white: "#FFFFFF",        // Primary page background
          offwhite: "#FAFAFA",     // Section alt-background (value-prop strip, footer)
          surface: "#F4F4F5",      // Category/product image placeholders, input fields
          border: "#E5E5E5",       // Hairline dividers, card borders
          ink: "#0F1111",          // Primary headings, body copy (near-black)
          slate: "#3F3F46",        // Secondary text on light backgrounds
          mutedGray: "#767676",    // Paragraph descriptors, meta text
          blue: "#2563EB",         // Primary CTA / accent (matches "Purpose." highlight)
          blueDark: "#1D4ED8",     // Hover state for blue accent
          orange: "#FF9900",       // Secondary accent — badges, ratings, small highlights
          black: "#0F1111",        // True black — used only inside dark product cards
          darkGray: "#1A1A1A",     // Dark product-card backgrounds (flat-lay photography panels)
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        widest: '0.25em',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 17, 17, 0.04), 0 1px 8px rgba(15, 17, 17, 0.03)',
        cardHover: '0 8px 24px rgba(15, 17, 17, 0.08)',
      }
    },
  },
  plugins: [],
};