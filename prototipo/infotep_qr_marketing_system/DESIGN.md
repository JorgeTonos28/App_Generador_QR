---
name: INFOTEP QR Marketing System
colors:
  surface: '#111125'
  surface-dim: '#111125'
  surface-bright: '#37374d'
  surface-container-lowest: '#0c0c1f'
  surface-container-low: '#1a1a2e'
  surface-container: '#1e1e32'
  surface-container-high: '#28283d'
  surface-container-highest: '#333348'
  on-surface: '#e2e0fc'
  on-surface-variant: '#c7c5d2'
  inverse-surface: '#e2e0fc'
  inverse-on-surface: '#2f2e43'
  outline: '#918f9c'
  outline-variant: '#464651'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#252770'
  primary-container: '#131360'
  on-primary-container: '#7e80cf'
  inverse-primary: '#5457a2'
  secondary: '#ebc246'
  on-secondary: '#3d2f00'
  secondary-container: '#b08c09'
  on-secondary-container: '#352800'
  tertiary: '#61de8a'
  on-tertiary: '#00391a'
  tertiary-container: '#00260f'
  on-tertiary-container: '#009c51'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#0d0c5c'
  on-primary-fixed-variant: '#3c3e88'
  secondary-fixed: '#ffe08b'
  secondary-fixed-dim: '#ebc246'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#7efba4'
  tertiary-fixed-dim: '#61de8a'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#111125'
  on-background: '#e2e0fc'
  surface-variant: '#333348'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1440px
---

## Brand & Style

The design system is engineered for the **INFOTEP QR Generator Marketing App**, a platform that bridges institutional reliability with modern marketing agility. The brand personality is **authoritative, tech-forward, and efficient**. It aims to instill confidence in institutional users while providing a frictionless, high-energy environment for marketing professionals.

The visual style follows an **Experimental Dark Mode** direction. It utilizes a deep navy foundation to maintain institutional gravity, punctuated by vibrant yellow and green accents that symbolize data energy and successful conversion. The interface employs a mix of **Modern Corporate** structure with **Glassmorphic** accents—using subtle transparency and high-contrast typography to create a sense of depth and technical sophistication without sacrificing legibility.

## Colors

The palette is anchored by a **Deep Navy (#131360)**, providing a sophisticated, institutional atmosphere. This dark canvas allows the functional accents to command attention:

- **Primary (Navy):** Used for large surfaces, sidebars, and primary branding elements.
- **Secondary (Yellow):** The "Marketing Spark." Used for primary calls to action, QR code focus states, and high-priority alerts.
- **Tertiary (Green):** Representing "Success" and "Active" status. Used for generated QR confirmations, positive growth metrics, and active user status.
- **Neutral/Background:** A multi-layered dark scale that prevents "pure black" eye strain, using deep blue-grays to maintain color harmony.

## Typography

This design system uses a dual-font strategy to balance technical innovation with readability:

- **Sora (Headlines):** A geometric sans-serif with a futuristic edge. It is used for all display text and major headings to emphasize the "Generator" aspect of the app.
- **Plus Jakarta Sans (Body & Labels):** Chosen for its exceptional legibility in dark mode. Its slightly wider apertures ensure that dense data (like user tables or marketing metrics) remains accessible and friendly.

All type scales are set to a 4px baseline grid to ensure vertical rhythm. For mobile devices, headlines scale down to prevent awkward line breaks while maintaining a strong visual hierarchy.

## Layout & Spacing

The system utilizes a **Fluid-Fixed Hybrid Grid**. 
- **Desktop:** A 12-column grid with a maximum width of 1440px. Content is centered with 48px outer margins.
- **Tablet:** An 8-column grid with 24px margins.
- **Mobile:** A 4-column grid with 16px margins.

Spacing follows a linear scale based on a **4px unit**. For marketing dashboards, we prioritize "White Space" (or rather, "Dark Space") to separate QR management cards, ensuring the UI never feels cluttered despite the data-heavy nature of marketing analytics.

## Elevation & Depth

In this dark mode system, depth is achieved through **Tonal Layering** and **Subtle Inner Glows** rather than heavy shadows.

1.  **Level 0 (Background):** The deepest navy (#0B0B24).
2.  **Level 1 (Cards/Tables):** A slightly lighter navy (#131360) with a 1px border of 10% white to define edges.
3.  **Level 2 (Modals/Popovers):** Surface color with a subtle "Glass" effect (backdrop-blur: 12px) and a soft ambient shadow (0px 8px 24px rgba(0,0,0,0.5)).
4.  **Interactive States:** Elements that are clickable should have a subtle 1px yellow top-border or an inner glow when hovered, signaling the "Marketing" energy of the platform.

## Shapes

The design system adopts a **Pill-Shaped (Level 3)** roundedness strategy to soften the technical navy-heavy environment and provide a modern, app-like feel.

- **Buttons & Chips:** Use the full "Pill" radius for a friendly, interactive look.
- **Cards & Data Tables:** Use a `rounded-lg` (2rem) setting to maintain a structural container while echoing the circular motifs found in the INFOTEP logo.
- **Form Inputs:** Use a `rounded-md` (1rem) setting to provide a clear, distinct area for data entry while remaining consistent with the overall soft-geometric theme.

## Components

### Buttons
- **Primary:** Background in Vibrant Yellow (#F2C94C), Text in Deep Navy (#131360). Heavy bold weight.
- **Secondary:** Transparent background with a 2px Yellow border. 
- **Ghost:** White text with no background, used for low-priority actions in user tables.

### Input Fields
- Dark-filled backgrounds (#1A1A2E) with 1px border (#303060).
- Focused state: Border transitions to Yellow with a 2px outer glow.
- Labels: Small, uppercase "Plus Jakarta Sans" above the field.

### QR Management Cards
- Feature a square "Safe Area" for the QR code preview on the left.
- Vital stats (Scan counts, Date created) on the right using Sora Medium.
- A "Status" chip in the top right corner (Green for active, Yellow for pending).

### User Tables
- **Header:** Sora Bold, 12px, 40% opacity white.
- **Row:** Alternating dark tints (Zebra striping) with a subtle 1px bottom divider.
- **Actions:** Icon-based buttons for "Edit", "Download QR", and "Delete".

### Success States
- Notification toasts and success banners utilize the Tertiary Green (#27AE60) with white text, positioned at the top-center to confirm QR generation.