---
name: Serene Assurance
colors:
  surface: '#f5fbf8'
  surface-dim: '#d6dbd9'
  surface-bright: '#f5fbf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5f2'
  surface-container: '#eaefec'
  surface-container-high: '#e4e9e7'
  surface-container-highest: '#dee4e1'
  on-surface: '#171d1b'
  on-surface-variant: '#3d4946'
  inverse-surface: '#2c3230'
  inverse-on-surface: '#ecf2ef'
  outline: '#6d7a76'
  outline-variant: '#bcc9c5'
  surface-tint: '#006b5f'
  primary: '#00685c'
  on-primary: '#ffffff'
  primary-container: '#008375'
  on-primary-container: '#f4fffb'
  inverse-primary: '#64dac7'
  secondary: '#3d665e'
  on-secondary: '#ffffff'
  secondary-container: '#bde9df'
  on-secondary-container: '#416a62'
  tertiary: '#864f13'
  on-tertiary: '#ffffff'
  tertiary-container: '#a3662a'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#82f6e2'
  primary-fixed-dim: '#64dac7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#c0ebe2'
  secondary-fixed-dim: '#a4cfc6'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#254e47'
  tertiary-fixed: '#ffdcc1'
  tertiary-fixed-dim: '#ffb878'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6c3a00'
  background: '#f5fbf8'
  on-background: '#171d1b'
  surface-variant: '#dee4e1'
typography:
  display-xl:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  button:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
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
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system is built upon a foundation of compassion, privacy, and professional reliability. The brand personality is "The Quiet Guardian"—someone who is present, capable, and calm during a storm. It avoids the clinical coldness of traditional healthcare in favor of an editorial, warm, and approachable aesthetic.

The visual style is **Modern Corporate with Organic Minimalist influences**. It utilizes generous whitespace (breathing room) to lower cognitive load for users who may be in distress. The aesthetic is characterized by soft edges, human-centric photography, and thin, rhythmic line-art motifs that represent interconnectedness and safety.

## Colors

The color strategy centers on a "Misted Coastline" palette to ground and soothe the user. 
- **Primary (Seafoam Teal):** Used for main actions, navigation, and brand identity to signal clarity, renewal, and stability (#089D8C).
- **Secondary (Muted Sage):** Reserved for accent moments, subtle highlights, and supportive icons to provide a sense of calm endurance (#567F77).
- **Tertiary (Soft Peach):** Provides warmth and a human touch, used for gentle highlights and celebratory UI elements (#FFB470).
- **Neutral (Slate Grey):** Used for typography to ensure high legibility while remaining softer than pure black (#727876).

## Typography

This design system employs a sophisticated serif/sans-serif pairing. **Newsreader** provides an editorial, trustworthy, and authoritative voice for headlines, echoing the feeling of a respected publication or a calm letter. **Manrope** is used for all functional and body text; its modern, geometric construction ensures clarity and professionalism at all sizes.

Hierarchy is maintained through significant scale shifts and generous line heights to ensure the platform feels spacious and readable for users under stress.

## Layout & Spacing

The layout utilizes a **Fixed Grid** model (12 columns) centered on the screen to provide a sense of containment and order. 

A "Low-Density" philosophy is applied here. Section gaps are intentionally large to prevent the user from feeling overwhelmed by information. Elements should use an 8px base grid, but vertical margins between unrelated components should lean toward larger increments (64px, 80px, or 120px) to maintain the calming, airy atmosphere.

## Elevation & Depth

To maintain a soft and approachable feel, this design system avoids heavy shadows. Instead, depth is communicated through:
- **Tonal Layering:** Using subtle variations of surface containers to distinguish sections.
- **Ambient Glows:** Where shadows are necessary (such as floating action buttons), use extremely diffused, low-opacity shadows tinted with the primary teal (#089D8C at 5% opacity).
- **Hairline Strokes:** Using 1px borders in a muted version of the secondary color (15% opacity) to define boundaries without creating "walls."
- **Backdrop Blurs:** Using glassmorphism sparingly on navigation bars to maintain context of the background imagery while ensuring text legibility.

## Shapes

The shape language is defined by **Organic Geometry**. While standard UI elements like cards and buttons use a consistent 0.5rem to 1rem corner radius, the system is overlaid with "Celestial Motifs"—thin-stroked circles and orbiting paths. 

These organic motifs should be used as background decorations to break the rigidity of the grid and symbolize a "holistic" approach to wellbeing. Icons should always be housed in circular containers or follow a rounded-corner silhouette.

## Components

### Buttons
- **Primary:** Solid Seafoam Teal with white text. High-contrast, rounded corners (0.5rem), used for critical actions like "Get Help Now."
- **Secondary:** Transparent background with a Sage Green 1px stroke. 
- **Tertiary:** Text-only with an underline or a simple trailing arrow icon in Peach for "Learn More" links.

### Cards
Cards should feature a white or very light neutral background. They use a subtle 1px border instead of a shadow. Content inside should be padded generously (32px+). For service-oriented cards, images should have a slight "fade-to-surface" gradient at the bottom to blend into the card content.

### Input Fields
Inputs should be minimalist: a bottom-border only or a very light-grey soft-rounded box. Focus states should transition the border to Primary Teal with a soft outer glow.

### Chips & Tags
Used for categories (e.g., "Crisis Support," "Therapy"). These should be pill-shaped with a low-saturation background of the primary color and dark teal text.

### Organic Accents
Incorporate "Orbit" elements—thin (1px) circular lines with small nodes—around key call-to-action areas or imagery to draw the eye in a non-aggressive manner.