# PRD: Concept Your Kitchen (CYK Hospitalities) Website Redesign

**Prepared for:** Moksh (Galileo & Duke)
**Client:** CYK Hospitalities Pvt. Ltd. (conceptyourkitchen.com)
**Source of truth:** Content audit of the live site (home, company overview, projects, team) on 16 Nov 2026
**Status:** Draft v2 (added paper-plane hero and journey spec, section 5.1)

---

## 1. Overview

CYK Hospitalities is a Gurugram-based F&B and restaurant consultancy. They take food businesses from an idea to an operating, expanding brand: concept, location, menu, kitchen, interiors, hiring, marketing and franchising.

The current site is a WordPress (WPBakery) brochure. It lists services in a flat grid and gives no sense of the one thing that sells CYK: **they build a food business from zero and stay with it as it grows.**

**Redesign goal:** turn the site into a single guided story, **"From empty plot to expanding brand"**, where every CYK service appears at the moment in a business's life when it matters, proven by real projects and client quotes.

### One-line positioning (proposed)
> We build food businesses from scratch, and stay until they scale.

This draws on the site's own mission ("help restaurants and hospitality businesses reach their true position") and the Why Us line about guiding clients "till the end."

---

## 2. Problems with the current site (from the audit)

| # | Finding | Impact |
|---|---|---|
| 1 | Services are a flat 12-card list with no order or narrative | Visitors can't see how CYK takes a client from zero to scale |
| 2 | **Navigation and homepage disagree on service names.** Nav: Brand Building, Property Leasing, Location Mapping Strategies. Homepage: Brand Expansion, Interior Planning, Uniform Designing, Public Relations, Kitchen Setup & Equipment | Confusing; weak SEO structure |
| 3 | Only three of the homepage service cards link to a page; the rest are plain text | Dead ends |
| 4 | No numbers anywhere (years, projects, cities, outlets) | No proof of scale |
| 5 | Testimonials are text-only quotes, no outcome or logo | Lower trust than they could be |
| 6 | Projects page is ~45 logo tiles with a one-word tag (QSR, Bar & Restaurant, Brand Expansion) and no case-study story | Doesn't show *what CYK did* or the result |
| 7 | Closing line "Perseverance is power" is generic | Missed positioning opportunity |
| 8 | Viewport sets `user-scalable=no` | Accessibility failure (blocks zoom) |
| 9 | Contact block shows `hometownchai@gmail.com` next to the CYK email | Looks like a leftover from another project; confirm with client |
| 10 | Social handles are inconsistent (X: `CykLt` in header vs `CykLtd` in footer) | Broken or wrong link risk |
| 11 | "Terms & Condition" links to `#` | Dead legal link |
| 12 | Hero slider carries six one-line labels (Restaurant Conceptualisation, Recipe Development, Menu engineering, Chef Hiring & Training, Restaurant Interior, Restaurant Marketing) with no CTA | Wasted first screen |
| 13 | Generic Gmail address and WhatsApp as the only lead channels; no structured enquiry | Unqualified leads |
| 14 | Team page lists two directors only | Thin credibility for a "team of experts" claim |

---

## 3. Goals and success metrics

**Business goals**
1. Generate more qualified leads from first-time restaurateurs and expanding brands.
2. Communicate the "zero to scale" end-to-end offer within the first 10 seconds.
3. Make past work credible through case studies, not logos.

**Metrics** (baselines to be pulled from the client's analytics; targets to be agreed)

| Metric | Baseline | Target |
|---|---|---|
| Enquiry form submissions + WhatsApp clicks per 1,000 visits | [CLIENT TO PROVIDE] | [AGREE] |
| Share of visitors reaching the "Expansion" (final) stage of the journey | n/a | [AGREE] |
| Service-page views per session | [CLIENT TO PROVIDE] | [AGREE] |
| Lighthouse: Performance / Accessibility / SEO (mobile) | [MEASURE] | 90+ / 100 / 100 |
| Largest Contentful Paint (mobile, 4G) | [MEASURE] | under 2.5 s |

---

## 4. Audience

1. **First-time founder** ("I have an idea and a budget"). Needs concept, location, menu, kitchen, financial planning.
2. **Operator with 1-3 outlets** ("I want to grow"). Needs location mapping, leasing, brand building, hiring, franchising.
3. **Property owner / hotel / institution** ("I want a food offer for my space"). Needs concept plus backend operations (the Goethe-Institut cafeteria, Midas Inn hotel and Sky Jumper food court projects show this).

---

## 5. Core concept: "The Growth Journey"

A scroll-driven narrative. A single visual object (an empty plot that becomes a kitchen, then a storefront, then a map of outlets) transforms as the visitor scrolls. Each stage names the CYK service, shows a real project as proof, and ends with a stage CTA.

### Journey stages, mapped to real CYK services

| Stage | Title (working) | CYK services shown | Proof from the current site |
|---|---|---|---|
| 0 | **The Idea** | Conceptualization, Recipe Development | Ndori Strabe (European-themed cafe concept), Crispee (R&D) |
| 1 | **The Numbers** | Restaurant Financial Planning | Service copy on custom financial plans |
| 2 | **The Place** | Location Mapping Strategies, Property Leasing | The Fat Tiger ("perfect locations"), Gianis ("provided locations that propelled" them) |
| 3 | **The Menu & Kitchen** | Menu Planning & Engineering, Kitchen Setup & Equipment | Case studies tagged Backend Operations (Nagari, Momo Mami) |
| 4 | **The Brand & Space** | Branding & Designing, Interior Planning, Uniform Designing | The Wok Bar, Hit A Pint, Ndori Strabe |
| 5 | **The Team** | Hiring & Trainings (chef hiring and training) | Service copy on chef recruitment |
| 6 | **The Launch** | Restaurant Marketing, Public Relations | Service copy on campaigns and PR |
| 7 | **The Expansion** | Brand Expansion, Franchising, Leasing | Twisting Scoops, House of Candy, Schmitten, The Belgian Fries and the 2023 Brand Expansion project set |

### Service naming (fix the nav/homepage mismatch)
Group the 12 offerings into the 8 stages above. Keep existing URLs as redirects:
`/brand-building`, `/property-leasing`, `/fb-consultancy`, `/conceptualization`, `/hiring-trainings`, `/location-mapping-strategies`, `/restaurant-financial-planning`, `/menu-planning-engineering`.
Add pages for services that currently have none: Kitchen Setup & Equipment, Interior Planning, Uniform Designing, Restaurant Marketing, Public Relations.

### 5.1 Hero and the Paper Plane (signature interaction)

**Idea:** Restaurants start on paper (a napkin sketch, a menu card, an order slip). The hero opens on a napkin with a rough concept sketch. It folds into a paper plane, and the plane then flies down the whole page along a dotted trail, pausing at each of the 8 stages. The trail is the customer's journey; it does not end with the hero.

**Hero behaviour**
1. **Load (about 1.5 s, plays once):** a napkin with a hand-sketched counter, menu scribble and map pin folds into a plane. The headline "Every restaurant starts as a sketch." sits beside it. The primary CTA ("Start your journey") and WhatsApp CTA are visible immediately and never wait for the animation.
2. **First scroll:** the plane detaches and begins following the trail path.
3. **Each stage:** the plane eases to a brief stop, a stamp appears, the stage content reveals, then the plane continues.
4. **Stage 7 (Expansion):** the trail forks into several dotted routes ending in map pins. Use city names only for locations the client confirms (current projects include Gurugram/Delhi NCR, Meerut, Bareilly, Agra).

**Trail rules**
- Dots appear only *behind* the plane. The upcoming route is not pre-drawn.
- The trail becomes slightly bolder after each stage (the business becomes more real).
- One celebratory loop at Stage 6 (Launch). Used once only.
- Plane rotates along the path tangent with smoothing and a slight bank on turns.
- Scroll velocity affects it lightly: faster scroll stretches the dash spacing and tilts the nose; it settles when scrolling stops.

**Stamps per stage** (use one icon library, e.g. Lucide or Phosphor, with a single stroke width and colour; no custom-drawn icons)

| Stage | Stamp (example icon) |
|---|---|
| 0 Idea | Lightbulb or pencil sketch |
| 1 Numbers | Calculator |
| 2 Place | Map pin / key |
| 3 Menu & Kitchen | Utensils / chef knife |
| 4 Brand & Space | Palette / armchair |
| 5 Team | Chef hat / users |
| 6 Launch | Megaphone / spark |
| 7 Expansion | Store / network of pins |

**Build approach: what is generated by code vs. supplied as an asset**

AI-assisted ("vibe") coding is unreliable at hand-authoring SVG path coordinates and illustration geometry. Therefore:

| Element | How it is made |
|---|---|
| Trail path | **Generated in code, never hand-written.** Measure each stage element with `getBoundingClientRect`, turn the positions into waypoints, build a smoothed path (Catmull-Rom or cubic Bezier helper) and set the SVG `d` attribute from JS. Rebuild on resize (debounced). Separate, simpler waypoint set for mobile |
| Plane position and rotation | Scroll progress (0-1) mapped to a precomputed lookup table of points along the path, plus a point slightly ahead for the angle. Avoid calling `getPointAtLength` every frame |
| Dotted trail | Same path with round-capped `stroke-dasharray`, revealed to the plane's position with `stroke-dashoffset` or a mask |
| Stops at stages | Scroll-progress remap table that eases in and out near each stage; tuned by eye |
| Plane graphic | One supplied asset (two-tone folded-paper plane with soft shadow, SVG or transparent PNG). If the agent's version looks off, swap the asset; do not keep re-prompting geometry |
| Stamps | Icon library (see above) |
| Napkin-to-plane fold | **Frame sequence, not coded animation.** Produce the fold as a short video or image set in an image/video tool, export 40-60 frames (WebP, about 720 px wide, total weight budget about 1.5 MB), draw on a `<canvas>`. Same technique as the Galileo & Duke site. Plays on load, then scroll takes over |
| Visual debugging | Playwright screenshots at 3-4 scroll positions per breakpoint so the agent can see and correct misalignment |

**Fallbacks**
- `prefers-reduced-motion`: no flight and no fold. Show the finished dotted route with all stamps as a static vertical list; plane rests at the final stage.
- Mobile: vertical version of the same trail with fewer, larger curves; no pinned sections for the whole journey (pin only briefly at stops).
- No-JS / failed asset: hero shows the final plane image and the headline; stages render as a normal list.

**Performance**
- Animate `transform` and `stroke-dashoffset` only.
- 2D SVG/canvas only (no Three.js) to protect mobile load time.
- Test Safari/iOS early (SVG masks and dasharray differ).

**Acceptance criteria**
- Plane stays aligned with each stage at widths 360, 768, 1024, 1440 px.
- Hero CTAs are interactive within 1 s of load, regardless of animation state.
- Trail never visibly jumps or restarts on resize or on scroll direction change (scrolling back up reverses the flight).
- 60 fps scroll on a mid-range Android device.
- Fully usable with reduced motion on and with keyboard only.

**Assets to produce before build:** plane graphic, napkin sketch, 40-60 fold frames, stamp style sheet (icon choice, stroke width, colour). Estimated effort for the interaction (one developer, assets ready): about 2 weeks, buildable in stages (plane on path across three sections first, then responsive path and stops, then fold/loop/fork, then fallbacks and cross-browser testing).

---

## 6. Information architecture

```
/                       Home (Growth Journey)
/services               Journey overview (index of all stages)
/services/[slug]        One page per service (13 incl. new ones), each with
                        "where this fits in your journey" strip
/projects               Filterable work (see 6.1)
/projects/[slug]        Case study (see 6.2)
/about                  Company overview + mission
/team                   Team (Pulkit Arora, Simranjeet Singh + room to add)
/horeca-talks           Blog / insights
/horeca-talks/[slug]
/careers
/contact                Structured enquiry + WhatsApp
/privacy-policy
/terms                  (replaces the dead "#" link)
```

### 6.1 Projects: filters
Replace the single tag with two facets:
- **Business type:** QSR, Bar & Restaurant, Cafe, Bakery, Dessert Parlor, Brewery & Restaurant, Hotel, Food Court, Buffet Concept, Kids Play Area, Institutional/Cafeteria
- **Stage CYK worked on:** Concept, Location, Menu/R&D, Backend Operations, Brand Expansion

### 6.2 Case study template (new)
Client and category, the brief, **which journey stages CYK covered**, what was delivered, outcome (metric where the client can supply one), quote (if any), gallery. Start with 6 flagship case studies; the rest remain logo tiles linking to a short page.

**Initial project inventory (from the live site)**
- Latest: WalkN'oodles (QSR), The Switch (Bar & Restaurant), The Inclusive P(a)late (Bakery, Gurgaon), My Bar Headquarters Defence Colony (Bar & Restaurant)
- Also listed: LANY, Thamel, My Bar HQ Bareilly / Meerut / Agra, Crispee, Nagari (Pure Vegetarian Catering), Bira 17, Spanish Churros, Sky Jumper, Momo Mami, Goethe-Institut Cafeteria, Delia My Bar HQ, Kidz N Klapz, Labneh, Urban Deck, Barbeque Carnival, Emotive Ale, Casa Doña, PHOMO, Lowkey Café, Fiona Café, Midas Inn, The Chutney Culture, Keepsake Bakehouse, Via Bianca, Sassy Desserts, Sodhilicious, The Wok Bar, Chelvies, Hit A Pint
- Brand Expansion set: Medley, Sutra, Starbucks, Schmitten, Twisting Scoops, Mannat, Burger Singh, Chicago Pizza, House of Candy, The Waffle Co., 99 Pancakes, The Belgian Waffle

> **Client to confirm:** the exact scope of work on big-name brands (e.g. Starbucks, Burger Singh, Baskin Robbins testimonial) and permission to show their logos. Wording must say what CYK actually did (e.g. "leasing and expansion consulting"), not imply ownership.

---

## 7. Homepage specification

| Section | Content | Source / note |
|---|---|---|
| **Hero** | Napkin sketch that folds into a paper plane (see 5.1). Headline: "We build food businesses from scratch." (alternate: "Every restaurant starts as a sketch.") Subline: "From the first idea to your tenth outlet." Primary CTA "Start your journey" (scrolls to Stage 0). Secondary CTA "Talk to us" (WhatsApp) | New copy based on mission; CTAs visible before the animation finishes |
| **Proof strip** | Logos/names of featured clients and counters for years active, projects, cities | Counters need client data; do not invent |
| **Growth Journey (stages 0-7)** | Paper-plane dotted trail with brief stops (see 5.1); each stage = headline, 2-line description from current service copy, 1 proof project, link to service page | Section 5 |
| **Choose your starting point** | Three cards: "I have an idea", "I have outlets and want to grow", "I have a space to fill". Each deep-links to the relevant stage | New; segments audience |
| **Selected work** | 6 flagship projects as large cards with the stages CYK covered | Section 6.2 |
| **Voices** | The 11 existing testimonials in a carousel, each tagged with the stage it speaks to (e.g. The Fat Tiger tagged "The Place") | Existing quotes, reused as-is |
| **Why CYK** | Existing text: strong support and bond with clients, guidance till the end, brand value and social recognition | Rewrite for clarity, keep the meaning |
| **Gallery** | Existing 16 food images (Prawn Risotto, Croissant, Corn Chaat, Ramen, Golgappe, Paneer Thecha Taco, Sabudana Falafel, etc.) shown as "Recipe development, from the CYK test kitchen" | Confirm these are CYK's own creations |
| **HoReCa Talks** | Latest two articles | Existing |
| **Final CTA** | "Tell us what you're building" + enquiry form | Replaces "Perseverance is power" |
| **Footer** | Address (76-D, Phase IV, Udyog Vihar, Sector 18, Gurugram, Haryana 122022), phone +91 82852 88098, email, four social links (fix handle inconsistency), Privacy, Terms | Existing |

### Testimonials (existing, keep)
Baskin Robbins (Mr. Rajeev), Gianis (Mr. Amarpreet Singh), Hit A Pint (Mr. Siddharth Chaudhary), Chai Garam (Mr. Bhrigu Dutt), Ndori Strabe (Mr. Prateek Nagar), The Fat Tiger (Mr. Saurabh Vij), House of Candy (Mr. Vikas Shukla), Schmitten luxury chocolates (Mr. Mausam Desai), Twisting Scoops (Mr. Kunwar Juneja), The Wok Bar (Mr. Shivam Sharma), The Belgian Fries (Mr. Rohan Chug).

---

## 8. Enquiry flow (replaces Gmail + generic contact)

Short multi-step form:
1. **Where are you?** Idea / Have a space / Running outlets / Want to franchise
2. **What are you building?** Business type (same list as project filter)
3. **Which stages do you need help with?** Multi-select of the 8 stages
4. **City, budget range, timeline**
5. **Name, phone, email**

Submission goes to the CYK inbox and creates a WhatsApp-ready summary. Keep the floating WhatsApp button. Confirmation page states response time (client to confirm).

---

## 9. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| F1 | Scroll-driven Growth Journey with 8 stages, led by the paper plane and dotted trail (spec in 5.1), with keyboard and reduced-motion alternatives (stages render as a static vertical list) | P0 |
| F1a | Napkin-to-plane fold intro as a canvas frame sequence; path generated in code from measured stage positions, responsive and rebuilt on resize | P0 |
| F2 | Service pages for all 13 services, each linking back to its journey stage | P0 |
| F3 | Filterable projects (2 facets) and case-study template | P0 |
| F4 | Multi-step enquiry form with validation and spam protection | P0 |
| F5 | WhatsApp click-to-chat with prefilled message by page context | P0 |
| F6 | HoReCa Talks blog with CMS-editable posts | P1 |
| F7 | Redirect map from all current URLs, preserving SEO | P0 |
| F8 | CMS so the CYK team can add projects, case studies, testimonials and posts without code | P0 |
| F9 | Careers page with role listing and apply form | P2 |
| F10 | Analytics events: stage reached, CTA clicks, form step drop-off, WhatsApp clicks | P1 |

---

## 10. Non-functional requirements

- **Performance:** LCP under 2.5 s on mobile 4G; optimised and lazy-loaded imagery (the current site loads large uncompressed banner images); animate transform/opacity only.
- **Accessibility:** WCAG 2.2 AA; **remove `user-scalable=no`**; respect `prefers-reduced-motion`; visible focus states; alt text on all project and gallery images.
- **SEO:** Keep and improve existing meta strategy (Delhi NCR, restaurant consultants India, F&B consultancy, kiosk and leasing consulting); structured data (Organization, LocalBusiness, Service, Article); sitemap; clean URL redirects.
- **Responsive:** Mobile-first. Most restaurateur traffic will be on phones, so the journey must work as a tap/scroll vertical flow on small screens.
- **Security/privacy:** Privacy policy and Terms pages live; consent-aware analytics.

---

## 11. Design direction

- **Feel:** Confident and warm, not corporate-consultant grey. An operator's workshop crossed with a premium hospitality brand.
- **Journey visual:** The paper plane and dotted trail (5.1) are the signature element. Paper and napkin textures, hand-sketched line quality for the opening napkin, and consistent single-style stamps along the route. 2D SVG and a light canvas frame sequence only; no 3D, to protect mobile performance.
- **Typography:** One expressive display face for stage titles, one highly readable text face. Large numerals for stage numbers (01-08).
- **Color:** Pull from the existing CYK logo and food photography; one strong accent that works on both light and dark sections.
- **Imagery:** Use real project and food photography from the current gallery and project tiles. Request original hi-res files from the client; many project tiles are logos only.
- **Motion principles:** Motion explains progress (something is being built); it never decorates. Short, purposeful, interruptible; reduced-motion fallback for everything.

---

## 12. Recommended agent skills (for the build)

Install these in the project before starting implementation so the coding agent follows consistent animation craft and design taste.

1. **emilkowalski/skills** (animation and interaction craft; use for the Growth Journey transitions, hover and tap feedback, easing and timing)
   ```bash
   npx skills@latest add emilkowalski/skills
   ```

2. **Leonxlnx/taste-skill, `design-taste-frontend`** (design taste for typography, spacing, layout and avoiding generic UI)
   ```bash
   npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
   ```

3. **pbakaus/impeccable** (design quality and polish pass)
   ```bash
   npx impeccable install --providers=claude --scope=project
   ```
   Then run `/impeccable init` in the project.

**How to use them in this build:** run the taste skill when designing the stage layouts and homepage; apply the animation skill when building each stage transition and the enquiry form micro-interactions; run impeccable for the polish pass before each milestone.

---

## 13. Suggested tech approach

- **Framework:** Next.js (App Router) with TypeScript, Tailwind, deployed on Vercel.
- **Motion:** Motion (Framer Motion) for component transitions and scroll progress (`useScroll`, `useTransform`) driving the plane along a JS-generated path; GSAP ScrollTrigger + MotionPath is an acceptable alternative. Canvas for the fold frame sequence. Details in 5.1.
- **Content:** Headless CMS (Sanity or similar) for projects, case studies, testimonials, services and posts, so CYK can self-serve. Migrate existing WordPress content, then retire WPBakery.
- **Forms:** Server action or API route with spam protection, email delivery to the CYK inbox.
- **Analytics:** Privacy-friendly analytics plus event tracking listed in F10.

---

## 14. Milestones

| Phase | Scope | Output |
|---|---|---|
| 0. Discovery | Client call: confirm scope of work per brand, metrics, leads data, asset files, permissions to use logos; fix open items below | Signed-off content inventory |
| 1. Design | Journey storyboard, homepage and one service page in high fidelity, case-study template; hero assets (plane, napkin sketch, fold frames, stamp sheet); throwaway prototype of the plane following a path across three sections to validate scroll feel | Approved designs and assets |
| 2. Build | Homepage, journey, services, projects, enquiry flow, CMS | Staging site |
| 3. Content | Migrate projects/testimonials/posts; write 6 flagship case studies; new service pages | Populated CMS |
| 4. QA and launch | Accessibility, performance, redirects, analytics, cross-device testing | Live site |

---

## 15. Open questions for the client

1. What are the real headline numbers (years in business, projects, cities, outlets launched)?
2. Which projects can be written up as full case studies, and what measurable outcomes can be shared?
3. What exactly did CYK do for the large brands on the Brand Expansion list, and may their logos be shown?
4. Is `hometownchai@gmail.com` supposed to be on the contact block? Which email should leads go to?
5. Which X/Twitter handle is correct (`CykLt` or `CykLtd`)?
6. Are the 16 gallery dishes CYK's own recipe-development work?
7. Do they want to add more team members and a testimonial photo/logo for each quote?
8. Do they want to keep the "HoReCa Talks" name and the posting cadence (two posts on 26 Sep 2026 currently)?
9. Is the Careers page active, and are there open roles?
10. Preferred response-time promise for enquiries?

---

## Appendix: Current site data used

- **Meta description (home):** "We are food consulting and Restaurant consultants in India. At our core, we help grow your food business by crafting profit-making plans."
- **Company overview:** "one of the best F&B consultancies in Delhi NCR"; services span conceptualization, F&B consultancy, HoReCa marketing, chef hiring and training, franchising and leasing, PR, and interior design. Mission: help restaurants and hospitality businesses reach their true position; vision of world-class consultation for every F&B establishment regardless of size.
- **Team:** Pulkit Arora (Director and Restaurant Consultant), Simranjeet Singh (Director and Leasing Consultants).
- **Contact:** 76-D, Phase IV Udyog Vihar, Sector 18, Gurugram, Haryana 122022; conceptyourkitchen@gmail.com; +91 82852 88098.
- **Socials:** Facebook, Instagram, LinkedIn, X (conceptyourkitchen / CykLtd).
