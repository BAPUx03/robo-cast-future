# Machine source audit

Audit date: 7 October 2026

## Source priority

1. `MODTECH_Casting_Machines_Master_Final.pdf` for investment-casting machine names, descriptions, technical data, options, and model tables.
2. `Original Modtech - Robotics & Automation - Packaging for script.docx` for robotics and packaging machine copy and supplied photographs.
3. The published Modtech website as a cross-check for established product identity and legacy product-page information.

No technical value was copied from one machine into another. Where the supplied PDF described a product but supplied no embedded product photograph, the catalogue deliberately shows no machine image and labels the image area as unavailable.

## Final catalogue count

| Division | Machines |
| --- | ---: |
| Investment Casting | 29 |
| Robotics & Automation | 5 |
| **Total** | **34** |

## PDF-only machines added

The following seven source-document products did not previously have their own catalogue pages. Each has a separate machine record, route and specification table. No genuine photograph was available in the supplied documents or on the legacy website, so no product image is published for them.

| Source product | Catalogue slug | Image status |
| --- | --- | --- |
| Shell Drying Conveyor | `shell-drying-conveyor` | Genuine image unavailable |
| Stucco Elevator / Bucket Elevator | `stucco-elevator` | Genuine image unavailable |
| Vertical Sander | `vertical-sander` | Genuine image unavailable |
| Slurry Preparation Tank | `slurry-preparation-tank` | Genuine image unavailable |
| Shell Hangers | `shell-hangers` | Genuine image unavailable |
| IC-Series Shell-Handling Robot | `ic-series-robot` | Genuine image unavailable |
| Robot Gripper | `robot-gripper` | Genuine image unavailable |

## Source reconciliation notes

- The PDF's nine wax-injection model documents are variants and specification sheets belonging to the existing 4-Pillar and C-Frame product families. They remain model rows on those family pages rather than being counted as nine unrelated machines.
- The repeated 50-ton wax-injection source sheet is a duplicate source entry, not an additional machine.
- `Rotary Rainfall Sanders` maps to the existing `rain-sander` product family. Its catalogue title and dimensional/configuration details were updated from the supplied master PDF.
- `Wash/Rinse Tank`, `Slurry Tank`, and the other website-writeup products map to their existing catalogue machines; their detail copy was expanded from the supplied documents without creating duplicates.
- The DOCX's five primary systems map one-to-one to Robotic Case Erector, Robotic Case Packer, Robotic Palletizing System, Pick & Place Automation, and Vision Inspection System. Their existing document-supplied photographs are reused in the galleries.

## Verification target

The automated catalogue audit checks all 34 machine detail pages, expects 29 casting listing links and 5 robotics listing links, verifies every referenced local image, checks image alternative text, and confirms that a missing machine slug returns HTTP 404.

## Final cross-check result

- Re-read the PDF product sections and the five primary DOCX system sections against the corresponding catalogue records.
- Removed all seven AI-generated representative visuals. Machines without a genuine source photograph now display an explicit unavailable-image message.
- Removed `palletizing-line.png` from the Robotic Palletizing gallery because the photograph shows a case-packing line; the two verified palletizing installation photographs remain.
- Confirmed that catalogue source files are clean UTF-8 and that degree, range, multiplication and separator symbols render from the correct characters.
- Final automated result is recorded after each catalogue verification run; the audit accepts a machine without an image only when the page otherwise remains complete and contains no broken image reference.
