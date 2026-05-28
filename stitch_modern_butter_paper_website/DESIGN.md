---
name: Organic Kitchen Design System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#45483c'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#76786b'
  outline-variant: '#c6c8b8'
  surface-tint: '#54652a'
  primary: '#536429'
  on-primary: '#ffffff'
  primary-container: '#6b7d3f'
  on-primary-container: '#ffffff'
  inverse-primary: '#bacf88'
  secondary: '#9a451c'
  on-secondary: '#ffffff'
  secondary-container: '#fd9262'
  on-secondary-container: '#742a01'
  tertiary: '#5e5e5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#767672'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6eba1'
  primary-fixed-dim: '#bacf88'
  on-primary-fixed: '#151f00'
  on-primary-fixed-variant: '#3c4c14'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb597'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#7b2f05'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is rooted in the intersection of industrial professionalism and organic warmth. It targets culinary professionals and eco-conscious home cooks who value food safety and sustainable quality. 

The visual style is **Modern Minimalism** with a tactile twist. It leverages heavy whitespace to evoke the "cleanliness" of food-grade paper, while the color palette brings in the warmth of cooked food and natural materials. The emotional response should be one of "trusted freshness"—reliable enough for a commercial kitchen, yet friendly enough for a family home.

## Colors

The color palette is derived directly from the earthy tones of organic produce and traditional kitchen graphics.

*   **Primary (Moss Green):** Represents safety, sustainability, and freshness. Used for main actions and brand signifiers.
*   **Secondary (Terra Cotta):** An appetite-stimulating accent used for highlights, secondary CTAs, and badges.
*   **Tertiary (Parchment):** A warm off-white used for section backgrounds to reduce ocular strain and mimic the texture of butter paper.
*   **Neutral (Charcoal):** A high-contrast dark gray for typography to ensure AA accessibility and a professional, "ink-on-paper" feel.

## Typography

This design system utilizes **Manrope** for its crisp, geometric construction and exceptional legibility. 

Hierarchy is established through tight line-heights in headlines to create a "blocky," authoritative feel, contrasted with generous line-heights in body text for a breezy, editorial reading experience. For labels and captions, use uppercase with slight letter-spacing to denote technical or "stamped" information, reminiscent of food packaging labels.

## Layout & Spacing

The design system employs a **Fluid 12-column Grid** that prioritizes negative space. 

*   **Desktop:** 12 columns with 64px outer margins to give content "room to breathe," mirroring the expansive nature of a clean kitchen counter.
*   **Tablet:** 8 columns with 32px margins.
*   **Mobile:** 4 columns with 20px margins.

Spacing units follow a strict 8px base grid. Section gaps are intentionally large (120px+) to separate different product narratives (e.g., durability vs. eco-friendliness) without visual clutter.

## Elevation & Depth

To maintain a "fresh and clean" aesthetic, this design system avoids heavy drop shadows. Instead, it uses **Tonal Layers** and **Low-Contrast Outlines**.

*   **Surface Hierarchy:** The base canvas is white. Secondary information sits on a Tertiary (Parchment) background. 
*   **Subtle Depth:** High-priority cards or "floating" navigation elements use an extremely diffused ambient shadow: `0 8px 32px rgba(107, 125, 63, 0.08)`. The slight green tint in the shadow keeps the depth feeling natural rather than synthetic.
*   **Borders:** Use 1px solid borders in a lightened version of the neutral color for input fields and dividers to maintain a "crisp" edge.

## Shapes

The shape language is **Rounded (Level 2)**. 

While the layout is structured and professional, the 0.5rem (8px) base radius softens the interface, making it feel more approachable and organic. This avoids the harshness of sharp corners, reflecting the pliable, soft nature of the paper product itself. Buttons and chips should use larger radii (rounded-lg or rounded-xl) to appear more "touchable."

## Components

*   **Buttons:** Primary buttons use the Moss Green background with white text. They should have a subtle scale-down effect (98%) on click to provide tactile feedback.
*   **Input Fields:** Use a white background with a 1px Charcoal border (20% opacity). On focus, the border transitions to Moss Green with a 2px thickness.
*   **Cards:** Use the "Parchment" tertiary color as a base for cards. Avoid borders; let the color change define the container.
*   **Chips/Badges:** Use Terra Cotta for "Eco-Friendly" or "Food Safe" badges to draw immediate visual attention.
*   **Lists:** Utilize "check-mark" icons in Moss Green to highlight product benefits, ensuring each item has generous vertical padding (16px).
*   **Product Graphics:** Incorporate subtle pattern overlays in backgrounds that mimic the food icons from the product roll, used at 5% opacity to add texture without distracting from content.