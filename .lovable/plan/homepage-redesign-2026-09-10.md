# Homepage redesign

## Goal
Rebuild the homepage into a premium, responsive industrial experience using the uploaded Modtech document as the factual source.

## Visual direction
- Keep the selected Industrial Carbon palette: `#05100F`, `#10201E`, `#3FE0A5`, `#B8C5C2` through semantic design tokens.
- Use Space Grotesk for headings and DM Sans for body copy.
- Use an asymmetric, image-led composition with real Modtech machinery photography.
- Make motion feel mechanical and controlled: clipped image reveals, staggered content entrances, subtle image parallax, precise hover movement, and reduced-motion support.

## Homepage structure
1. Create an immersive first screen with the Modtech offer, two clear solution paths, real machinery media, and early proof points.
2. Present the two divisions as large asymmetric visual chapters rather than matching cards.
3. Add a focused automation solutions showcase using actual case erector, case packer, palletizing, pick-and-place, and machine-tending content.
4. Explain Modtech’s engineering advantage using document-backed facts: indigenous development, customised turnkey systems, Industry 4.0 readiness, low maintenance, and global support.
5. Add an industries strip and customer/partner proof without repeating navigation links.
6. Consolidate contact prompts into one strong enquiry section while retaining the working form.

## Content rules
- Use only supported company facts from the uploaded document and existing verified content.
- Retain 1994, 1000+ projects, 45+ countries, two facilities, 25+ modules, 250+ talent pool, and 10+ Fortune 500 customers where appropriate.
- Keep existing navigation, enquiry submission behavior, footer, theme switcher, and accessibility.

## Technical details
- Refactor `src/routes/index.tsx` into clear focused sections, reusing existing content collections and real uploaded image assets.
- Extend `src/styles.css` only for reusable homepage motion and reveal behavior, with `prefers-reduced-motion` handling.
- Verify desktop and mobile layouts, image loading, links, form visibility, console output, and build status.
