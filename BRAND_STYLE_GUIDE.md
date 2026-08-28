# Kingdom Drip Brand Style Guide

**Version:** 1.0  
**Last Updated:** August 28, 2026  
**Maintained By:** @mr-h-digital  

---

## 🎯 Brand Mission

Kingdom Drip exists for a generation unashamed of the Gospel. We design bold, modern streetwear that sparks conversations about faith, community, and purpose. Every purchase funds Rock Mission Ministries' outreach on the Cape Flats.

**Tagline:** "Got That Kingdom Drip"  
**Audience:** Gen Z (16–28), Cape Town-based, faith-forward, socially conscious  

---

## 🎨 Visual Identity

### Color Palette

#### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Midnight** (bg-apparel-bg) | `#0a0a0a` | 10, 10, 10 | Primary dark background |
| **Void** (bg-apparel-panel) | `#1a1a1a` | 26, 26, 26 | Secondary panel background |
| **Cream** (text-apparel-cream) | `#f5f5dc` | 245, 245, 220 | Primary text, high contrast |

#### Accent Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Teal** (text-apparel-teal) | `#20e3cf` | 32, 227, 207 | Primary CTA, highlights, "hope" |
| **Pink** (text-apparel-pink) | `#ff2fa3` | 255, 47, 163 | Secondary CTA, community, energy |
| **Volt** (text-apparel-volt) | `#ffff00` | 255, 255, 0 | Tertiary accent, bold statements |
| **Gray** (text-apparel-muted) | `#888888` | 136, 136, 136 | Secondary text, low emphasis |

#### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#10b981` | Order confirmation, positive states |
| Warning | `#f59e0b` | Limited stock, expiring soon |
| Error | `#ef4444` | Errors, validation failures |

### Gradients

#### Primary Gradient (CTAs)
```css
background: linear-gradient(135deg, #20e3cf 0%, #ff2fa3 100%);
/* Teal → Pink, used on "Shop" buttons */
```

#### Fire Gradient (Optional, for art)
```css
background: linear-gradient(135deg, #ff2fa3 0%, #ffff00 100%);
/* Pink → Volt, energetic sections */
```

#### Volt Gradient (Optional, for emphasis)
```css
background: linear-gradient(135deg, #ffff00 0%, #20e3cf 100%);
/* Volt → Teal, high-energy accent */
```

### Border & Overlay

| Element | Value | Usage |
|---------|-------|-------|
| Border Color | `rgba(245, 245, 220, 0.2)` | Card borders, dividers |
| Border Radius | `16px` (rounded-2xl) | Cards, buttons |
| Shadow | `0 4px 20px rgba(0, 0, 0, 0.5)` | Depth, emphasis |
| Backdrop Blur | `12px` | Glass morphism on overlays |

---

## 🔤 Typography

### Font Stack

#### Display (Headlines)
```css
font-family: 'Poppins Bold', 'Segoe UI', sans-serif;
font-weight: 700;
letter-spacing: 0.02em;
```
**Usage:** H1, H2, hero taglines, brand name  
**Size Range:** 32px–88px (responsive)  

#### Body (Content)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-weight: 400;
line-height: 1.6;
```
**Usage:** Paragraphs, descriptions, testimonials  
**Size:** 14px–18px  

#### Accent (Labels, CTAs)
```css
font-family: 'Poppins', sans-serif;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.1em;
```
**Usage:** Button text, labels, badges  
**Size:** 12px–14px  

### Hierarchy

```
H1: 56–88px, bold, teal text
H2: 32–48px, bold, cream text
H3: 24–32px, semibold, cream text
Body: 16–18px, regular, cream/muted text
Small: 12–14px, semibold, muted text (labels)
Caption: 11–12px, regular, muted text (secondary info)
```

### Line Height
- Headings: 1.1 (tight, impactful)
- Body: 1.6 (readable, spacious)
- Labels: 1.4 (balanced)

---

## 🎬 Component Patterns

### Buttons

#### Primary CTA (Shop, Subscribe, etc.)
```jsx
className="rounded-full bg-grad-drop px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-apparel-bg transition-transform hover:scale-105"
```
- Teal → Pink gradient
- Rounded pill shape
- All-caps text
- Hover: scale up 5%
- Padding: 8px horizontal, 3.5px vertical
- Min-width: 120px, Min-height: 44px (mobile friendly)

#### Secondary CTA (Learn More, etc.)
```jsx
className="rounded-full border border-apparel-teal bg-apparel-teal/10 px-8 py-3 text-sm font-bold uppercase tracking-widest text-apparel-teal hover:bg-apparel-teal hover:text-apparel-bg"
```
- Teal border + light fill
- Hover: solid teal background
- Same sizing as primary

#### Ghost CTA (Links, etc.)
```jsx
className="text-sm font-bold uppercase tracking-widest text-apparel-teal hover:underline"
```
- Teal text, no background
- Hover: underline
- Used inline in text

### Cards

#### Standard Card
```jsx
className="rounded-2xl border border-apparel-border bg-apparel-bg/50 p-6 backdrop-blur-sm transition-all hover:border-apparel-teal hover:bg-apparel-bg/70"
```
- Dark background with transparency
- Subtle border
- Backdrop blur (glass effect)
- Hover: teal border + darker background
- Padding: 24px
- Used for: products, testimonials, drops, stats

#### Featured Card
```jsx
className="rounded-2xl border border-apparel-teal bg-apparel-panel/60 p-6 shadow-lg shadow-apparel-teal/20"
```
- Teal accent border
- Slight glow shadow
- Higher visual hierarchy

### Badges

#### Type Badge
```jsx
className="inline-flex items-center rounded-full border border-apparel-volt/40 bg-apparel-volt/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-apparel-volt"
```
- Volt text + light background
- Thin border
- Used for: section labels, product types, drop types

#### Status Badge
```jsx
className="inline-block rounded-full bg-apparel-pink/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-apparel-pink"
```
- Color varies by status (teal, pink, volt)
- Solid light background
- Used for: limited stock, upcoming, sold out

### Input Fields

#### Text Input
```jsx
className="flex-1 rounded-full bg-apparel-panel px-4 py-3 text-sm text-apparel-cream placeholder-apparel-muted/50 focus:outline-none focus:ring-2 focus:ring-apparel-teal"
```
- Rounded pill shape
- Dark background
- Cream text
- Teal focus ring
- Padding: 16px horizontal, 12px vertical

---

## 📐 Spacing System

```css
/* Tailwind spacing scale (4px base) */
2px   = 0.5
4px   = 1
8px   = 2
12px  = 3
16px  = 4
24px  = 6
32px  = 8
40px  = 10
48px  = 12
64px  = 16
80px  = 20
96px  = 24
```

### Common Patterns
- Card padding: 24px (p-6)
- Section padding: 80px vertical, 16px horizontal (py-20, px-4)
- Button padding: 16px horizontal, 12px vertical (px-4, py-3)
- Gap between cards: 16px (gap-4)

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```
Mobile: 0px–639px (all devices)
sm: 640px+ (tablets portrait)
md: 768px+ (tablets landscape)
lg: 1024px+ (small laptops)
xl: 1280px+ (large laptops)
2xl: 1536px+ (desktops)
```

### Grid Patterns
| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Products | 2 cols | 3 cols | 4 cols |
| Testimonials | 1 col | 2 cols | 4 cols |
| Stats/Metrics | 2 cols | 3 cols | 6 cols |
| Features | 1 col | 2 cols | 3 cols |

### Font Scaling
- Mobile: -2px from base
- Tablet: -1px from base
- Desktop: base size
- Large Desktop: +2px from base

---

## ✨ Animation & Micro-Interactions

### Transitions
```css
transition-all 200ms ease-in-out; /* Standard */
transition-transform 300ms ease-out; /* Movement */
transition-opacity 200ms ease-in; /* Fade */
```

### Hover States
- Buttons: `scale-105` (grow 5%)
- Cards: `border-apparel-teal bg-apparel-bg/70` (brighten + accent)
- Links: `underline` (simple emphasis)

### Entrance Animations
- Fade in: 300ms ease-in
- Slide up: 400ms ease-out (from bottom)
- Number counter: 2000ms ease-out (for stats)

### Loading States
- Skeleton: Gray pulse at 1.5s interval
- Spinner: Rotating teal circle (2s)
- Progress: Teal bar expanding left-to-right

---

## ♿ Accessibility

### Color Contrast
- All text on background: >= 4.5:1 contrast ratio (WCAG AA)
- Teal on dark background: 7.2:1 ✅
- Cream on dark background: 15.7:1 ✅

### Interactive Elements
- Min-width/height: 44px (touch-friendly)
- Focus state: Teal ring border (2px, offset 2px)
- All buttons have `:focus-visible` state

### Semantic HTML
- Use `<button>`, `<a>`, `<nav>`, not `<div>` for interactivity
- Images have alt text
- Forms have `<label>` for inputs
- Headings use proper hierarchy (h1 → h6)

### Screen Reader
- Use `aria-label` for icon-only buttons
- Use `aria-live="polite"` for dynamic updates
- Use `role="region"` for custom components

---

## 🖼️ Imagery

### Photo Style
- High contrast, bold compositions
- Gen Z aesthetic: authentic, candid, diverse
- 3:4 or 16:9 aspect ratio preferred
- Dark backgrounds (minimal light backgrounds)
- People: diverse, confident, unashamed

### Icons
- Emoji preferred (simple, universal, fun)
- Or Feather Icons (crisp, minimal)
- Size: 24px–64px
- Color: Match text color (teal, pink, volt, cream)

### Product Images
- Clean white or dark background
- Multiple angles (front, back, detail)
- Lifestyle shots (people wearing gear)
- Thumbnail: Square 1:1, no crop
- Hero: 16:9, lifestyle context

---

## 📝 Voice & Tone

### Messaging Principles
- **Bold:** No apologies, confident, unapologetic
- **Real:** Authentic stories, genuine impact, no corporate BS
- **Hopeful:** Faith-forward but not preachy, inspiring, inclusive
- **Gen Z:** Conversational, emoji-friendly, self-aware humor

### Examples

❌ **Corporate (avoid):**
"Kingdom Drip is pleased to announce a new collection of apparel for the discerning customer."

✅ **Kingdom Drip (use):**
"New drop alert 🚨 Back-to-School Kingdom hits Sept 1. Limited pieces. Bold faith."

---

### Copy Patterns
- CTAs: "Shop Now →", "Notify Me", "Join the Movement"
- Headlines: Active voice, benefit-focused
- Testimonials: First-person, authentic language
- Product names: Capitalize key words, use metaphors (e.g., "Winter Layers Vol. II")

---

## 🔄 Pattern Library (Reusable)

### Alert/Notification
```jsx
// Success
<div className="rounded-lg bg-green-500/10 border border-green-500 px-4 py-3 text-sm text-green-400">
  Order confirmed! 🎉
</div>

// Error
<div className="rounded-lg bg-red-500/10 border border-red-500 px-4 py-3 text-sm text-red-400">
  Something went wrong. Try again.
</div>
```

### Loading Skeleton
```jsx
<div className="h-12 w-full rounded-lg bg-apparel-panel animate-pulse" />
```

### Empty State
```jsx
<div className="text-center py-12">
  <div className="text-4xl mb-4">😴</div>
  <h3 className="text-xl font-bold text-apparel-cream">Nothing here yet</h3>
  <p className="text-apparel-muted">Check back soon</p>
</div>
```

---

## 🎯 Design Principles

1. **Mobile-First:** Design for 375px first, scale up
2. **Dark Mode Default:** Kingdom Drip *is* dark mode
3. **Performance:** No heavy animations, < 8KB added per feature
4. **Accessibility:** WCAG 2.1 AA minimum
5. **Gen Z Auth:** Emoji, bold colors, confidence, no corporate speak
6. **Purpose:** Every pixel should communicate impact or community
7. **Bold & Real:** No gradual fades—go all in or don't do it

---

## 🚀 Implementation Checklist

Before shipping any new feature:
- [ ] Follows color palette (no arbitrary colors)
- [ ] Typography matches hierarchy (h1–caption scale)
- [ ] Buttons use pattern (primary/secondary/ghost)
- [ ] Spacing follows 4px grid
- [ ] Mobile responsive (375px, 768px, 1280px tested)
- [ ] Focus states visible (keyboard navigation)
- [ ] Alt text on images
- [ ] Dark backgrounds only (no light mode)
- [ ] Hover states smooth (not jarring)
- [ ] Loading/error states handled
- [ ] Voice matches Kingdom Drip tone

---

## 📚 Reference Files

- **Components:** `src/components/` (inspect existing for patterns)
- **Colors:** `tailwind.config.js` (apparel-* color definitions)
- **Typography:** `src/index.css` (font loading, base styles)
- **Live Examples:** Home page, Shop page, Product detail

---

## 🤝 Contributing

**Need to update this guide?**
1. Make changes in a feature branch
2. Add justification in commit message
3. Get design approval
4. Merge to `main`

**Found inconsistency?**
1. Open an issue (tag @mr-h-digital)
2. Reference this guide
3. Suggest fix with example

---

## ❓ FAQ

**Q: Can I use a different color palette?**  
A: No. The teal/pink/volt palette is core to Kingdom Drip's Gen Z identity. Discuss with @mr-h-digital if you have concerns.

**Q: Can I use light backgrounds?**  
A: No. Kingdom Drip is dark-only. It's part of our brand.

**Q: Can I add animations?**  
A: Yes, but keep them smooth and purposeful (200–400ms, ease-in-out). Avoid >10 simultaneous animations.

**Q: How do I handle dark mode in the app?**  
A: We don't. Kingdom Drip is always dark. User OS dark mode preference is ignored.

**Q: Can I use different fonts?**  
A: Display uses Poppins, body uses system fonts. Don't add new font families.

**Q: What about mobile web vs. native app?**  
A: This guide applies to web. Mobile app team has separate guidelines.

---

## 📞 Contact

- **Design questions:** @mr-h-digital on Slack #kingdom-drip
- **Brand alignment:** Reach out to leadership @rock-mission-board
- **Implementation issues:** Ask in #frontend-help

---

**Version History:**
- v1.0 (Aug 28, 2026): Initial guide for Phase 1

---

*Designed for Kingdom Drip. Inspired by Gen Z. Built with purpose.*
