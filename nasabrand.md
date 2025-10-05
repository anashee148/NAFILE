Here’s a **complete UI design overview** derived from the *NASA Space Apps Brand Guidelines (May 2025)* — summarized specifically for your **UI/UX or front-end development work**:

---

## 🌍 NASA Space Apps — UI Development Overview

### 🪐 1. Brand Essence

NASA Space Apps is a **global innovation challenge** uniting coders, designers, and scientists to solve Earth and space problems using NASA’s open data.
→ The UI should reflect **trust, innovation, and discovery**, with a consistent visual identity across all digital interfaces.

---

### 🛰️ 2. Logo System (Responsive Design)

**Logo Variants:**

1. **Default Logo (Horizontal)** — Preferred for most layouts; aligns well with text or titles.
2. **Motif Logo** — Self-contained (orbit + text); ideal for merch, posters, standalone graphics.
3. **Small Logo (Orbit only)** — For tight spaces (favicons, social media avatars).

**Logo Rules:**

* Don’t alter colors, typography, or proportions.
* Don’t tilt, distort, or place on busy backgrounds.
* Always maintain clear space around the logo.

---

### 🎨 3. Color Palette

| Category  | Name              | HEX       | Use                           |
| --------- | ----------------- | --------- | ----------------------------- |
| Primary   | **Deep Blue**     | `#07173F` | Backgrounds, main UI sections |
| Accent    | **Electric Blue** | `#0042A6` | Highlights, gradients         |
| Highlight | **Neon Yellow**   | `#EAFE07` | Buttons, CTAs, key indicators |
| Secondary | **Rocket Red**    | `#E43700` | Alerts, attention areas       |
| Secondary | **Martian Red**   | `#8E1100` | Supporting visuals            |
| Neutral   | **White**         | `#FFFFFF` | Text on dark backgrounds      |
| Support   | **Blue Yonder**   | `#2E96F5` | Accent gradients, transitions |

**Gradient Rule:**

* Linear gradient from **Electric Blue → Deep Blue**, 45° top-left to bottom-right.
* Smooth transitions only; avoid harsh blending.

**Accessibility:**

* Maintain contrast ratios ≥ 4.5:1 (WCAG 2.0 AA).
* Use tools like **WebAIM Contrast Checker**.

---

### 📸 4. Photography Guidelines

* Use **high-resolution, full-color** imagery.
* Place images in **holding shapes** (preferably **circular** or rectangular).
* Don’t overlay text directly on images.
* Circles can overlap or act as orbits — avoid artificial edits.
* For context: use circular images as planets/orbits to align with the theme.

---

### 🔠 5. Typography

**Primary Fonts (Free & Open Source):**

* **Fira Sans** → Headings, large titles.
* **Overpass** → Body text, UI labels.
* **Fira Code** → Code or data displays.

**Type Hierarchy:**

| Level | Font              | Size     | Style                       |
| ----- | ----------------- | -------- | --------------------------- |
| H1    | Fira Sans Black   | 60px     | All Caps, 5% Letter Spacing |
| H2    | Overpass Regular  | 42px     | Uppercase or mixed case     |
| H3    | Overpass SemiBold | 20pt     | 150% line height            |
| Body  | Overpass Light    | 20pt     | 150% line height            |
| Code  | Fira Code Regular | Variable | Monospaced text sections    |

**Color Use in Text:**

* Backgrounds for text: Deep Blue, Electric Blue, or White.
* Avoid **Rocket Red** backgrounds.
* Use **Neon Yellow** sparingly for emphasis or links.
* Alternate text line colors (like flag stripes) for stylistic sectioning.

---

### 🔘 6. Buttons & Links

* **Primary Buttons:** Neon Yellow on Deep/Electric Blue.
* **Hover State:** Text shifts from Blue → Neon Yellow.
* **Secondary Links:** White or Slate Gray with hover color change to Neon Yellow.
* Keep rounded corners and generous padding (2xl radius).

---

### 🧩 7. Icons & Symbols

* Use **line-based** iconography, consistent stroke weight.
* Recommended libraries:
  → **Phosphor Icons**, **Feather Icons**, **Streamline Line**.
* Maintain high contrast; avoid filled icons unless necessary.
* Stick to clean geometric or orbit-based shapes.

---

### 🏅 8. Awards & Badges

* 3D illustrated icons for award categories.
* Can be enclosed in circular frames for “badge” effect.
* Available design assets: [Figma Brand Guide – Awards](https://www.figma.com/design/wHdW7W8eBpLmSQ4cwZoUjm/Space-Apps-Brand-Guide?node-id=109-1530)

---

### 🌀 9. Patterns & Backgrounds

* Use abstract **vector patterns** inspired by orbits, waves, code, and geometry.
* Apply at **~25% opacity** over blue backgrounds.
* Must use single-color vector art.
* Pattern assets: [Figma Brand Guide – Patterns](https://www.figma.com/design/wHdW7W8eBpLmSQ4cwZoUjm/Space-Apps-Brand-Guide?node-id=109-319)

---

### ⚙️ 10. General UI Implementation Tips

* Use a **modular layout**: grid-based, responsive scaling.
* Maintain strong **contrast** and visual clarity.
* Emphasize **motion and orbit imagery** for transitions.
* Use **Neon Yellow** sparingly to highlight interactions.
* Maintain consistent **padding**, **alignment**, and **typographic rhythm**.

---

Would you like me to now create a **Figma-ready color + typography style guide JSON / design token set** (so you can import directly into your UI project)?
That would include variables like `--primary-color`, `--font-heading`, etc., based on this NASA guide.
