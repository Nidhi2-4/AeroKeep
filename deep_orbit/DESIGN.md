---
name: Deep Orbit
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353435'
  on-surface: '#e5e2e2'
  on-surface-variant: '#c7c6cc'
  inverse-surface: '#e5e2e2'
  inverse-on-surface: '#313031'
  outline: '#919096'
  outline-variant: '#46464c'
  surface-tint: '#c5c5d4'
  primary: '#c5c5d4'
  on-primary: '#2e303b'
  primary-container: '#070913'
  on-primary-container: '#777886'
  inverse-primary: '#5c5e6a'
  secondary: '#c1c6db'
  on-secondary: '#2b3040'
  secondary-container: '#44485a'
  on-secondary-container: '#b3b7cc'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#000c10'
  on-tertiary-container: '#00859c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e1f1'
  primary-fixed-dim: '#c5c5d4'
  on-primary-fixed: '#191b26'
  on-primary-fixed-variant: '#444652'
  secondary-fixed: '#dee1f7'
  secondary-fixed-dim: '#c1c6db'
  on-secondary-fixed: '#161b2a'
  on-secondary-fixed-variant: '#414657'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#131314'
  on-background: '#e5e2e2'
  surface-variant: '#353435'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-base:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered to evoke the high-stakes, precision environment of an aerospace Head-Up Display (HUD). It targets professional drone fleet operators and technicians who require immediate access to complex telemetry and inventory data. 

The aesthetic is a sophisticated blend of **Glassmorphism** and **Technical Futurism**. It prioritizes legibility in low-light environments by utilizing high-contrast glowing accents against deep, vast backgrounds. The interface should feel like a transparent glass pane floating in a cockpit—weightless yet structured, with drifting grid lines that provide a sense of spatial depth and constant system readiness.

## Colors

This design system utilizes a "Deep Orbit" palette characterized by infinite depth and luminous data points. 

- **Base Layers:** The primary midnight navy provides the void-like background, while the secondary navy defines structural containers and panels.
- **Luminance:** Cyan and blue glows are reserved for interactive states, primary actions, and system-critical focus areas. 
- **Functional Accents:** Emerald, Amber, and Rose are used strictly for status indicators (Active, Warning, Error), ensuring they remain distinct from the primary UI brand colors.
- **Borders:** Subtle white and semi-transparent cyan borders are used to define glass edges without breaking the dark-mode immersion.

## Typography

Typography is split between human-centric UI elements and machine-centric data points.

- **Outfit** is used for all primary navigation, headings, and instructional text. Its geometric clarity provides a modern, approachable feel to an otherwise technical interface.
- **JetBrains Mono** is utilized for all SKU numbers, telemetry data, timestamps, and technical logs. The monospaced nature ensures that data columns remain perfectly aligned and highly readable during rapid scanning.
- **Headlines** should use tighter letter spacing to maintain a "machined" look, while **data labels** should use slightly increased spacing for maximum legibility at small sizes.

## Layout & Spacing

The layout follows a **Fluid Grid** model designed for data-dense environments.

- **Grid:** A 12-column grid is used for desktop views. Content should be grouped into logical modules that snap to these columns.
- **Rhythm:** A 4px baseline grid ensures tight, technical alignment. Spacing between related data points should be minimal (4px or 8px), while spacing between disparate functional groups should be generous (24px+).
- **Responsive Behavior:** On mobile, columns collapse to a single stack, but the density of the JetBrains Mono data points is preserved by reducing horizontal padding and using horizontal scrolling for large tables.
- **Drifting Lines:** Background grid lines should be rendered at 1px thickness with 5% opacity, providing a subtle structural scaffold for the glass panels.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism** and light emission rather than traditional shadows.

- **Surface Layers:** All primary containers use a backdrop-filter blur (12px - 20px) and a semi-transparent background color (10% - 20% opacity).
- **Outlines:** Instead of drop shadows, use 1px "ghost borders" in semi-transparent white (0.1 opacity). This mimics light catching the edge of a glass pane.
- **Top-Border Glows:** High-priority cards feature a 2px top-border glow using the Cyan or Blue primary colors, accompanied by a subtle outer bloom (10px blur, 0.4 opacity).
- **Interactive Depth:** When an element is hovered, the backdrop-blur intensity increases, and the border opacity rises, making the element appear to "float" closer to the user.

## Shapes

The shape language is "Soft" (Level 1) to maintain a balance between technical precision and modern ergonomics.

- **Corner Radii:** Standard UI components like buttons and cards use a 0.25rem (4px) radius. Larger layout containers may use 0.5rem (8px). 
- **Sharp Accents:** In specific data-heavy contexts, internal table cells or progress bar fills remain sharp (0px) to emphasize the "digital" nature of the data.
- **Scrollbars:** Custom scrollbars must be thin (4px - 6px width), using a primary Cyan thumb with a fully transparent track to avoid cluttering the visual field.

## Components

- **Sidebar Navigation:** A slim, semi-transparent pane on the left. Icons use thin strokes with a Cyan "active" glow. Labels appear only on hover or when expanded to save space.
- **Metric Cards:** Modular glass containers displaying real-time data. Each card features a top-aligned glow strip indicating the drone's status (e.g., Amber for low battery).
- **Data Tables:** High-density grids with no vertical borders. Horizontal borders use 1px depth at 5% white opacity. Row highlighting on hover uses a subtle 5% Cyan background tint.
- **Buttons:** Primary buttons are solid Cyan with black text for maximum contrast. Secondary buttons are outlined with a subtle inner glow effect.
- **Chips/Status Tags:** Small, pill-shaped elements with low-opacity background fills and high-intensity text colors (e.g., transparent rose background with solid rose text for "Critical").
- **Input Fields:** Dark, recessed backgrounds with a Cyan bottom-border that illuminates when the field is in focus.