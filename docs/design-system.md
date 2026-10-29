# Vienna Cuts design system

- **Canvas / surface:** `--canvas #f3f0e9`, `--surface #fffdf8`; inverse surface `--night #171817`.
- **Text:** `--ink #1c1b19`, muted `--muted #746f66`, line `--line #d8d2c7`.
- **Accent:** `--copper #9b613d`, dark action/hover `--copper-deep #754426`, highlight `--gold #c99a72`. Copper is used as an accent/action rather than small low-contrast body copy.
- **Status:** positive `#35664d`, destructive `#9b4037`; badges also include visible status text.
- **Type:** Georgia/Times serif display; Arial/Helvetica sans interface. Display headings use fluid `clamp()` sizes. No remote fonts.
- **Layout:** `.wrap` max 1280px, default 32px gutters (19px mobile); section spacing 104px desktop / 72px mobile; card corners intentionally square and editorial.
- **Motion:** short hover transitions; all animations/transitions are reduced under `prefers-reduced-motion`.
- **Breakpoints:** responsive compositions at 1050px, 760px and 390px; grids collapse rather than overflow.

Theme edits are centralized in the `:root` custom properties in `src/app/globals.css`.
