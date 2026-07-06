/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
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
        sans: [
          '"Be Vietnam Pro"',
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        // --- Bổ sung từ bản thiết kế Figma ---
        "headline-lg-mobile": ["Be Vietnam Pro"],
        "body-md": ["Be Vietnam Pro"],
        "body-lg": ["Be Vietnam Pro"],
        "headline-xl": ["Be Vietnam Pro"],
        "headline-lg": ["Be Vietnam Pro"],
        "headline-md": ["Be Vietnam Pro"],
        "label-sm": ["Be Vietnam Pro"],
        "label-md": ["Be Vietnam Pro"],
        "label-lg": ["Be Vietnam Pro"],
      },
      fontSize: {
        // --- Bổ sung từ bản thiết kế Figma ---
        "headline-lg-mobile": ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-xl": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "1.2", fontWeight: "500" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
      },
      spacing: {
        // --- Bổ sung từ bản thiết kế Figma ---
        gutter: "24px",
        xxl: "64px",
        xs: "4px",
        "margin-mobile": "16px",
        "margin-desktop": "48px",
        unit: "8px",
        "xl-spacing": "40px", // Đổi tên xl thành xl-spacing để tránh trùng lặp
        "bottom-nav-height": "64px",
        "gutter-mobile": "1rem",
        "stack-sm": "0.5rem",
        "stack-lg": "1.5rem",
        "stack-md": "1rem",
      },
      colors: {
        // --- Bổ sung các màu Dark Mode từ Figma (Nocturnal Brew) ---
        surface: "#1A0F06",
        "surface-dim": "#131313",
        "surface-bright": "#393939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#d8c3ad",
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
        "surface-variant": "#353534",
        "surface-tint": "#ffb95f",
        outline: "#a08e7a",
        "outline-variant": "#534434",

        "primary-container": "#f59e0b",
        "on-primary-container": "#613b00",
        "on-primary": "#472a00",
        "inverse-primary": "#855300",
        "primary-fixed": "#ffddb8",
        "primary-fixed-dim": "#ffb95f",
        "on-primary-fixed": "#2a1700",
        "on-primary-fixed-variant": "#653e00",

        "on-secondary": "#452a14",
        "secondary-container": "#5f4029",
        "on-secondary-container": "#d7ad8f",
        "secondary-fixed": "#ffdcc4",
        "secondary-fixed-dim": "#eabe9f",
        "on-secondary-fixed": "#2d1603",
        "on-secondary-fixed-variant": "#5f4029",

        "on-tertiary": "#3c2e22",
        "tertiary-container": "#c3ad9d",
        "on-tertiary-container": "#504135",
        "tertiary-fixed": "#f6decd",
        "tertiary-fixed-dim": "#d9c2b2",
        "on-tertiary-fixed": "#25190f",
        "on-tertiary-fixed-variant": "#534437",
        "tertiary-brand": "#dfc8b8", // Cấu hình bổ sung cho Tertiary

        error: "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "on-background": "#e5e2e1",

        // --- Cấu hình HIỆN CÓ của dự án (Giữ nguyên) ---
        primary: {
          DEFAULT: "#F59E0B",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          foreground: "#FFFFFF",
          brand: "#ffc174", // Tích hợp primary thuần từ Figma
        },
        secondary: {
          DEFAULT: "#2C1503",
          foreground: "#FFFFFF",
          brand: "#eabe9f", // Tích hợp secondary thuần từ Figma
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
          brand: "#1A0F06", // Mã màu nền Nocturnal Brew
        },
        foreground: "hsl(var(--foreground))",
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        neutral: {
          DEFAULT: "hsl(var(--neutral))",
          foreground: "hsl(var(--neutral-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
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
          shadow: "hsl(var(--card-shadow))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        status: {
          pending: "hsl(var(--status-pending))",
          confirmed: "hsl(var(--status-confirmed))",
          preparing: "hsl(var(--status-preparing))",
          completed: "hsl(var(--status-completed))",
          cancelled: "hsl(var(--status-cancelled))",
        },
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-background": "var(--gradient-background)",
        "gradient-card": "var(--gradient-card)",
      },
      boxShadow: {
        "custom-sm": "var(--shadow-sm)",
        "custom-md": "var(--shadow-md)",
        "custom-lg": "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      transitionProperty: {
        smooth: "var(--transition-smooth)",
        bounce: "var(--transition-bounce)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // --- Bổ sung từ Figma ---
        xl: "0.75rem",
        full: "9999px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};