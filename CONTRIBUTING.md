# Contributing

Contributions are welcome — bug fixes, new calculators, UI improvements, and documentation are all appreciated.

## Getting Started

```bash
git clone https://github.com/jwplatta/obsidian-calculators.git
cd obsidian-calculators
npm install
```

Run in watch mode while developing:
```bash
npm run dev
```

Deploy to your local Obsidian vault to test:
```bash
./bin/deploy.sh
```

The script targets `~/.obsidian/local_notes/`. Edit `bin/deploy.sh` to point to your own vault.

## Adding a New Calculator

1. **Add types** — define a `*Params` interface and add a `CalculatorType` value in `src/types.ts`. Add a default params constant and a `CALCULATOR_TYPES` entry.
2. **Add calculation logic** — create `src/calculators/yourCalculator.ts` with pure functions (no Obsidian or React imports).
3. **Add a React component** — create `src/components/YourCalculator.tsx`. Props should follow the pattern `{ initialParams, savedCalc, onSave }`.
4. **Wire up the view** — add a branch in `CalculatorView.render()` in `src/views/CalculatorView.ts` to render the new component when `activeType` matches.

## Code Style

- TypeScript strict mode is enabled — avoid `any` where possible
- React components are functional with hooks
- Calculation logic lives in `src/calculators/` and must be pure (no side effects)
- Obsidian API calls belong in services or view/modal classes, not components

## Submitting a Pull Request

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make your changes and verify the build passes: `npm run build`
3. Open a pull request with a clear description of what the change does and why

## Releasing

Releases are created via the **Release** GitHub Actions workflow (`workflow_dispatch`). Maintainers trigger it manually with a semver version string (e.g. `1.1.0`). The workflow builds the plugin, bumps `manifest.json`, creates a git tag, and attaches the release assets.
