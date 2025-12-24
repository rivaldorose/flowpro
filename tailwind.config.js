/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
  			serif: ['Fraunces', 'serif'],
  			mono: ['Courier Prime', 'monospace'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			brand: {
  				purple: '#6B46C1',
  				purpleDark: '#5B3CA1',
  				purpleLight: '#F3E8FF',
  				purpleBorder: '#E9D5FF',
  				orange: '#F97316',
  				orangeDark: '#EA580C',
  				orangeLight: '#FFF7ED',
  				purple: '#A855F7',
  				purpleLight: '#FAF5FF',
  				teal: '#14B8A6',
  				tealDark: '#0F766E',
  				tealLight: '#F0FDFA',
  				pink: '#F472B6',
  				pinkLight: '#FDF2F8',
  				pinkDark: '#831843',
  				bg: '#FAFAF9',
  				text: '#1F2937',
  				muted: '#78716C',
  				border: '#E5E7EB',
  				card: '#FFFFFF',
  				success: '#10B981',
  				dark: '#1F2937',
  			},
  			canvas: '#F5F5F4',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			fadeIn: {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' },
  			},
  			slideUp: {
  				'0%': { opacity: '0', transform: 'translateY(16px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			shake: {
  				'10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
  				'20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
  				'30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
  				'40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
  			},
  			widthGrow: {
  				'0%': { width: '0%' },
  				'100%': { width: '100%' }
  			},
  			scaleIn: {
  				'0%': { opacity: '0', transform: 'scale(0.8)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			fadeIn: {
  				'0%': { opacity: '0', transform: 'scale(0.95)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			fadeOut: {
  				'0%': { opacity: '1' },
  				'100%': { opacity: '0', pointerEvents: 'none' }
  			},
  			slideUp: {
  				'0%': { transform: 'translateY(20px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' }
  			}
  		},
		boxShadow: {
			'card': '0 2px 8px -1px rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
			'float': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			'paper': '1px 1px 3px rgba(0,0,0,0.1)',
			'sticky': '2px 2px 5px rgba(0,0,0,0.05)',
			'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fadeIn 0.5s ease-out forwards',
  			'slide-up': 'slideUp 0.5s ease-out forwards',
  			'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
  			'width-grow': 'widthGrow 0.4s ease-out forwards',
  			'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
  			'fade-out': 'fadeOut 0.3s ease-in forwards',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}