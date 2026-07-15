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
