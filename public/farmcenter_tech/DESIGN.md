---
name: Farmcenter Tech
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4f6073'
  primary: '#041627'
  on-primary: '#ffffff'
  primary-container: '#1a2b3c'
  on-primary-container: '#8192a7'
  inverse-primary: '#b7c8de'
  secondary: '#006875'
  on-secondary: '#ffffff'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#211200'
  on-tertiary: '#ffffff'
  tertiary-container: '#38260b'
  on-tertiary-container: '#a88c69'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4fb'
  primary-fixed-dim: '#b7c8de'
  on-primary-fixed: '#0b1d2d'
  on-primary-fixed-variant: '#38485a'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#feddb5'
  tertiary-fixed-dim: '#e1c29b'
  on-tertiary-fixed: '#281802'
  on-tertiary-fixed-variant: '#584326'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered to bridge the gap between high-tech reliability and the vibrant, bustling energy of a marketplace. It targets tech-savvy consumers looking for both high-end electronics and reliable service. 

The design style is **Corporate Modern with subtle Tech-Luxe influences**. It leverages a precision-led layout with high-quality whitespace to ensure clarity, while using vibrant accents to maintain an energetic, "market-fresh" feel. The emotional goal is to establish immediate trust and efficiency, ensuring the user feels secure while navigating a vast inventory of gadgets.

## Colors

This design system uses a high-contrast palette to drive hierarchy and trust:
- **Primary (Deep Tech Blue):** Used for navigation, headers, and primary branding to establish authority and professional stability.
- **Secondary (Tech-Cyan):** Reserved strictly for "Actionable Items" like CTAs, progress indicators, and interactive highlights. Its vibrancy ensures high visibility against the deep primary blue.
- **Surface & Backgrounds:** We use a "Soft-Clean" approach. Backgrounds are off-white (#F8FAFC) to reduce eye strain, while cards and containers use pure white (#FFFFFF) to pop forward.
- **Status Colors:** Use standard semantic colors (Success: Green, Error: Red, Warning: Amber) but desaturated slightly to match the professional tone.

## Typography

The system utilizes **Inter** for its exceptional readability in e-commerce contexts, especially on mobile device screens where specs and pricing must be crystal clear. **Geist** is introduced for labels and technical data to provide a "developer-tool" precision that reinforces the technology focus.

Headlines should use tighter letter spacing to maintain a "bold" and confident look. Body text prioritizes generous line height to improve the legibility of long product descriptions and technical specifications.

## Layout & Spacing

The layout follows a **Fluid Grid** model with high-density capabilities.
- **Desktop:** 12-column grid with 24px gutters. Use 64px outer margins to provide "breathing room" for premium product photography.
- **Mobile:** 4-column grid with 16px gutters and 16px margins. 
- **Spacing Logic:** All spacing is based on a 4px baseline. Use `md (24px)` for internal component padding and `lg (48px)` for vertical section separation. 

Content should be grouped into logical "pods" or cards to facilitate quick scanning, a necessity for a high-traffic marketplace.

## Elevation & Depth

This design system uses **Ambient Shadows and Tonal Layers** to represent depth without clutter.

1.  **Level 0 (Flat):** Main background surface (#F8FAFC).
2.  **Level 1 (Low):** Product cards and input fields. Uses a 1px border (#E2E8F0) and a soft 4px blur shadow with 5% opacity.
3.  **Level 2 (Medium):** Hover states and dropdown menus. Shadow blur increases to 12px with 8% opacity.
4.  **Level 3 (High):** Modals and sticky navigation bars. Uses a 20px blur shadow with a slight Primary Blue (#1A2B3C) tint at 10% opacity to ground the element.

Avoid heavy black shadows; always use a slight blue tint in shadow values to maintain the "Tech" aesthetic.

## Shapes

The shape language is defined by **Standardized Roundedness**.
- **Cards & Large Containers:** Use `rounded-lg` (16px) to soften the technical nature of the products and make the marketplace feel accessible.
- **Buttons & Inputs:** Use `rounded-md` (8px) for a more precise, functional appearance.
- **Badges/Chips:** Use full-round (pill-shaped) for status indicators like "In Stock" or "New Arrival."

Imagery should also follow these rounding rules, specifically with product thumbnails featuring a 12px corner radius.

## Components

### Buttons
- **Primary:** Background #1A2B3C, Text #FFFFFF. Solid, high-contrast.
- **CTA:** Background #00E5FF, Text #1A2B3C (for readability). Use for "Buy Now" or "Add to Cart."
- **Ghost:** Transparent background, #1A2B3C border (1px). Use for secondary actions like "View Specs."

### Cards
Product cards are the core of the system. They feature a white background, 16px corner radius, and a subtle transition on hover where the shadow deepens and the image scales by 2%. 

### Inputs
Fields should have a 1px border (#CBD5E1) that transitions to #00E5FF on focus. Labels use `label-md` for clarity.

### Chips & Badges
Small, high-contrast tags for "5G," "OLED," or "24-month Warranty." Use Primary Blue backgrounds with Cyan text for a distinct tech-tag look.

### Price Display
Price tags should be prominent, using `headline-md` in Primary Blue. Discounted prices should show the original price in a strike-through neutral gray.