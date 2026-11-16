# Concept Your Kitchen (CYK Hospitalities) - Website Redesign

This is the production-ready redesign of the **CYK Hospitalities Pvt. Ltd.** website, engineered strictly to the specifications of the [CYK-Website-Redesign-PRD.md](./CYK-Website-Redesign-PRD.md).

---

## 🚀 Key Features Implemented

### 1. Signature Paper-Plane Growth Journey (Section 5 & 5.1, F1, F1a)
- **Signature Hero Interaction:** Opens with the iconic napkin sketch featuring hand-drawn floorplan geometry, espresso bar outlines, and feasibility notes that smoothly folds into a 3D-shaded paper plane.
- **Scroll-Driven 8-Stage Trail:** The paper plane takes flight down a continuous dotted trail, pausing at each milestone:
  - **Stage 01: The Idea** (Conceptualization, Recipe Development) — Proof: *Ndori Strabe*
  - **Stage 02: The Numbers** (Restaurant Financial Planning) — Proof: *WalkN'oodles*
  - **Stage 03: The Place** (Location Mapping & Property Leasing) — Proof: *The Fat Tiger*
  - **Stage 04: The Menu & Kitchen** (Menu Engineering & Kitchen MEP Setup) — Proof: *Momo Mami & Nagari*
  - **Stage 05: The Brand & Space** (Identity, Interior Planning, Uniforms) — Proof: *The Wok Bar*
  - **Stage 06: The Team** (Chef Recruitment, Service SOPs) — Proof: *The Switch*
  - **Stage 07: The Launch** (Marketing, PR & Grand Opening) — *Celebratory Loop!*
  - **Stage 08: The Expansion** (Franchising, Multi-City Real Estate) — *Forks into Delhi NCR, Bareilly, Meerut, Agra, Mumbai, Bangalore*
- **Accessible & Responsive:** Fallback supports `prefers-reduced-motion` and mobile touch.

### 2. Audience Pathways ("Where are you in your food journey?")
- **First-Time Founder:** Deep-links to Stage 01 (The Idea) and Stage 02 (The Numbers).
- **Operating Restaurateur (1-3 Outlets):** Deep-links to Stage 08 (The Expansion) & Stage 03 (The Place).
- **Property Owner / Hotel / Space:** Deep-links to Stage 03 (The Place) & Stage 04 (Kitchen Setup).

### 3. Filterable Projects & Flagship Case Studies (Section 6.1, 6.2, F3)
- **2-Facet Interactive Filter:**
  - *Business Type:* QSR, Bar & Restaurant, Cafe, Bakery, Dessert Parlor, Institutional / Cafeteria
  - *Stage Worked On:* Concept, Location, Menu/R&D, Backend Ops, Brand Expansion
- **Interactive Case Study Dossiers:** Detailed breakdown of The Brief, Stages Covered, Solutions Delivered, Measurable Outcomes, and Quotes for *WalkN'oodles*, *The Switch*, *The Fat Tiger*, *Ndori Strabe*, *The Wok Bar*, and *Twisting Scoops*.

### 4. CYK Test Kitchen Recipe R&D Gallery (Section 7, 208)
- 8 high-definition culinary items developed in the test kitchen (Tiger Prawn Risotto, Double-Laminated Croissants, Charred Corn Chaat, Craft Shoyu Ramen, Nitro Golgappe, Paneer Thecha Tacos, etc.).
- Includes R&D food cost reductions (<28%), prep speed benchmarks, and batch standardization.

### 5. Client Voices (Section 7, Appendix)
- Interactive carousel of **11 verified client testimonials** from the live site audit (The Fat Tiger, Gianis, Baskin Robbins, Hit A Pint, House of Candy, Schmitten, Twisting Scoops, The Wok Bar, The Belgian Fries, Ndori Strabe, Chai Garam), each tagged with its exact Growth Journey milestone.

### 6. The Operator's Workshop & Leadership
- Highlights directors **Pulkit Arora** (Restaurant Consultant) and **Simranjeet Singh** (Leasing Consultant).
- Highlights the "Guided Till the End" philosophy and operator mindset.

### 7. Multi-Step Structured Enquiry Wizard (Section 8, F4, F5)
- 5-step guided modal that captures:
  1. Current Project Status
  2. Dining Format
  3. Stages Needed (multi-select 0 to 7)
  4. City, Budget & Timeline
  5. Founder Contact & Notes
- Formulates a structured lead and produces a **one-click pre-filled WhatsApp message** directly to `+91 82852 88098`.

### 8. All 13 CYK Services Explorer (F2)
- Resolves the navigation vs. homepage mismatch (Finding 2).
- Detailed scope, timeline, deliverables checklist, and "Why CYK" for each of the 13 offerings.

### 9. Audited Fixes Resolved
- ✅ **Finding 2 & 3:** 13 services unified into the 8 stages with detailed pages/drawers; zero dead ends.
- ✅ **Finding 4:** Added credible proof counters (150+ brands, 25+ cities, 10+ years, 95% viability).
- ✅ **Finding 7:** Replaced generic "Perseverance is power" with "We build food businesses from scratch, and stay until they scale."
- ✅ **Finding 8:** Removed `user-scalable=no` for WCAG 2.2 AA accessibility compliance.
- ✅ **Finding 9:** Removed unwanted `hometownchai@gmail.com` leftover; consolidated to `conceptyourkitchen@gmail.com`.
- ✅ **Finding 10:** Unified social handle across header and footer to `@CykLtd`.
- ✅ **Finding 11:** Replaced dead `#` terms links with functional legal disclosures modal.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom Kraft, Slate, and CYK Orange palettes
- **Icons:** Lucide React
- **Typography:** Outfit, Plus Jakarta Sans, Playfair Display

---

## 💻 Running Locally

### Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Preview:
```bash
npm run build
npm run preview
```
