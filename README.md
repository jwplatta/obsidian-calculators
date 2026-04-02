# Obsidian Calculators

A plugin for [Obsidian](https://obsidian.md) that provides interactive financial calculators with live charts, directly inside your vault.

## Features

- **Compound Interest Calculator** — model portfolio growth over time with configurable principal, rate, compounding frequency, and optional monthly contributions
- **Options Strategy Calculator** — model the long-run expected value of a systematic options selling strategy using closed-form expectancy math
- **Live charts** — charts update instantly as you adjust parameters
- **Save calculators** — save any calculator configuration as a JSON file in your vault, named and organized however you like
- **Load calculators** — fuzzy-search your saved calculators and reload them with all values intact
- **Saved calculators table** — view all saved calculators in a sortable table; click any name to reopen it

## Commands

| Command | Description |
|---|---|
| `Open calculator` | Fuzzy-search to select and open a calculator type |
| `Load saved calculator` | Fuzzy-search your saved calculators and open one |
| `View saved calculators` | Open the table view of all saved calculators |

## Settings

| Setting | Default | Description |
|---|---|---|
| Calculators directory | `calculators` | Vault folder where saved calculator JSON files are stored |

## Calculators

### Compound Interest

Models portfolio growth using the compound interest formula with optional periodic contributions.

**Parameters:**
- Initial principal
- Annual interest rate
- Compounding frequency (daily, monthly, quarterly, annually)
- Time period (years)
- Monthly contribution (optional)
- Inflation adjustment (optional)

### Options Strategy

Models the long-run expected value of a systematic options selling strategy (covered calls, cash-secured puts, iron condors, etc.).

**Formula:**
```
EV per trade = (win rate × profit per win) − ((1 − win rate) × loss per loss)
profit per win = total premium × profit target %
loss per loss  = total premium × max loss multiple
portfolio(year) = starting portfolio + EV per trade × trades per year × year
```

**Parameters:**
- Starting portfolio value
- Premium per share, contract multiplier, contracts per trade
- Profit target (% of premium)
- Max loss (multiple of premium)
- Win rate
- Capital per contract (buying power required)
- Trade frequency
- Duration (years)

## Installation

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/jwplatta/obsidian-calculators/releases/latest)
2. Create a folder at `<vault>/.obsidian/plugins/obsidian-calculators/`
3. Copy the three files into that folder
4. Open Obsidian → Settings → Community Plugins → enable **Calculators**

## Development

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/jwplatta/obsidian-calculators.git
cd obsidian-calculators
npm install
```

**Build:**
```bash
npm run build       # production build
npm run dev         # watch mode
```

**Deploy to local vault for testing:**
```bash
./bin/deploy.sh
```

The deploy script builds the plugin and copies `main.js`, `manifest.json`, and `styles.css` to `~/.obsidian/local_notes/.obsidian/plugins/obsidian-calculators/`. Edit the script to point to your own vault path.

## Tech Stack

- TypeScript
- React 18
- Recharts
- Obsidian API
- esbuild

## License

MIT — see [LICENSE](LICENSE)
