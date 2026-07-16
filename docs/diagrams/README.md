# Diagrams

Mermaid sources for the diagrams embedded in [`docs/architecture.md`](../architecture.md). Each `.mmd` file has a matching `.png` rendered from it — edit the `.mmd`, then regenerate the PNG, never the other way around.

| Source | Rendered | Diagram |
|---|---|---|
| `subsystem-decomposition.mmd` | `subsystem-decomposition.png` | Subsystem Decomposition |
| `use-case.mmd` | `use-case.png` | Use Case |
| `analysis-object-model.mmd` | `analysis-object-model.png` | Analysis Object Model |

## Regenerating

```bash
cd docs/diagrams
npx -y @mermaid-js/mermaid-cli -i <name>.mmd -o <name>.png -b white -w 1400 -s 2
```

Requires Node/npx (no global install needed — `npx -y` fetches `@mermaid-js/mermaid-cli` on demand and runs it headlessly via Puppeteer).

## Manual label fix in `analysis-object-model.png`

Mermaid's `classDiagram` layout has no `linkStyle`/spacing controls (unlike flowchart), so the auto-placed `belongs to` label originally overlapped the `Coach` box. This was fixed by hand-shifting that one label in the rendered SVG rather than in the `.mmd` — running the command above regenerates a technically-correct but visually-regressed PNG (label back on top of `Coach`). To reproduce the fix after a content change:

```bash
cd docs/diagrams
npx -y @mermaid-js/mermaid-cli -i analysis-object-model.mmd -o /tmp/aom.svg -b white
python3 -c "
svg = open('/tmp/aom.svg').read()
old = '<g class=\"edgeLabel\" transform=\"translate(861.98522, 520.13373)\"><g class=\"label\" data-id=\"id_Trainee_Team_8\"'
new = '<g class=\"edgeLabel\" transform=\"translate(861.98522, 600.13373)\"><g class=\"label\" data-id=\"id_Trainee_Team_8\"'
assert old in svg
open('/tmp/aom.svg', 'w').write(svg.replace(old, new))
"
chromium-browser --headless --disable-gpu --no-sandbox --screenshot=analysis-object-model.png \
  --window-size=3000,2600 --force-device-scale-factor=2 --default-background-color=FFFFFFFF /tmp/aom.svg
magick analysis-object-model.png -trim +repage analysis-object-model.png
```

The exact `translate(...)` coordinates are only valid for the current diagram content — if classes/associations change, re-render the plain SVG first and find the new `belongs to` label's transform before adjusting. ImageMagick's own SVG rasterizer (Inkscape delegate) doesn't render Mermaid's HTML `foreignObject` labels — text disappears — so the screenshot step must go through an actual browser (`chromium-browser --headless`), not `magick`/`convert` directly.
