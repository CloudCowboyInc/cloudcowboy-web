# Cloud Cowboy — Investor Data Room Build Spec (for Claude Code)

**Target repo:** `cloudcowboy-web` (local clone) — Vite + React 18 + TypeScript + Tailwind + shadcn/ui + React Router + Framer Motion + Recharts/Leaflet + Supabase.
**Audience of the product:** Quantum Ventures (Lee Skandalaris) conducting due diligence inside the gated investor portal.
**Tagline:** "The Ag Catalyst Through Service Instigation."

This file is the single source of truth. Every number and formula the app needs is in **§3 Canonical Data**. Do **not** invent numbers — read them from here and from the committed data files you create in Sprint 1/2.

---

## 1. How to run (autonomous sprint execution)

Sprints have codenames and run in this order:

**`SADDLE_UP` → `ENGINE_ROOM` → `TERRITORY` → `ROUNDUP` → `WAR_ROOM` → `LAST_MILE`**

Give Claude Code this command (point it at this file):

```
Open docs/DATAROOM_BUILD_SPEC.md. Execute the sprint named SADDLE_UP exactly as written.
When its Definition of Done passes (npm run typecheck && npm run build succeed, plus any
sprint tests), commit as "feat(dataroom): SADDLE_UP". Then automatically proceed to the
next sprint in the Sprint Order and repeat — implement, verify, commit after each — until
LAST_MILE is complete. If a step fails and you cannot fix it after 3 attempts, stop and
report what blocked you. Never fabricate numbers; pull them from §3 of the spec.
```

To run a single sprint only, replace the auto-advance sentence with: *"Stop after this sprint."*

**Per-sprint Definition of Done (applies to every sprint):**
- `npm run typecheck` passes (no TS errors; no `any`).
- `npm run build` passes.
- `npm run lint` passes (fix what you introduce).
- Any sprint-specific tests pass.
- App runs (`npm run dev`) with no console errors on the affected routes.
- Commit with the message shown in the sprint.

---

## 2. Global conventions

- **Brand — reuse, don't reinvent.** Pull colors, fonts, spacing, and the logo from the existing repo (`tailwind.config.*`, existing `InvestorPortal`/`Admin` components, `src/assets` or `public`). Match the current look exactly. Known palette anchor: deep green `#1F4E37` (primary), with the existing cream/sage neutrals. If a token already exists, use it; do not add new hex values without a reason.
- **Logo:** use the existing logo asset already in the repo; do not regenerate one.
- **Components:** use the shadcn/ui primitives already installed; use Framer Motion for transitions consistent with existing pages.
- **Auth/gating:** these pages live behind the existing investor-portal guard (`src/components/auth/Guards.tsx`). Reuse it; do not build new auth.
- **Routing:** add routes under the investor portal shell. Nav: **Market · Go-To-Market · Finance** (plus existing portal/data-room tabs).
- **State:** introduce one shared store, `src/lib/model/store.ts` (Zustand if not already present; otherwise React context matching `crm-store.tsx`). It holds editable assumptions + event/org toggles + raise/valuation, and all three pages read from it. This store is the "dynamic connection."
- **Charts:** Recharts (already used). **Maps:** existing Leaflet `USLeadMap`.
- **No new backend** unless a sprint says so. Toggle/assumption state is client-side (optionally persisted to `localStorage`, NOT browser-storage-restricted contexts).
- **Mobile-first + a11y** per the repo's existing standard (ARIA, keyboard nav, WCAG AA).

---

## 3. Canonical Data (single source of truth)

Sprint 1 must serialize all of this into `src/lib/model/data.ts` (typed constants). Years are index 0–5 = **2026, 2027, 2028, 2029, 2030, 2031**.

### 3.1 Scalar assumptions (defaults; all user-editable on Finance page)
| key | value |
|---|---|
| avgGmvPerCustomer | 900000 |
| subscriptionPerYear | 12000 |
| takeRate | 0.02 |
| transactionCapture | 1.00 |
| jobsPerCustomerYear | 150 |
| achCostPerJob | 5 |
| layer1AiPerFtePerYear | 6000 |
| platformCogsPerCustomer | 1800 |
| salesCommissionPerNewCustomer | 1200 |
| arrMultiple | 20 |
| targetCac | 2500 |
| raiseAmount | 1000000 |
| dilution | 0.20 |
| postMoney (derived = raise / dilution) | 5000000 |
| preMoney (derived = post − raise) | 4000000 |

### 3.2 Customers & demand (per year)
```
customersEOY     = [0, 125, 300, 650, 1250, 2000]
presold          = [50, 0, 0, 0, 0, 0]
preSeasonCapture = [0, 0.15, 0.30, 0.35, 0.35, 0.35]
annualChurn      = [0, 0.08, 0.07, 0.06, 0.055, 0.05]
gmvGrowth        = [0, 0.08, 0.10, 0.12, 0.13, 0.14]
```

### 3.3 Marketing stack (per year). Events & memberships are DERIVED from toggles (§3.6/3.7); the arrays below are the defaults when all are "Y".
```
social      = [50000, 120000, 120000, 120000, 120000, 120000]
digital     = [20000, 50000, 140000, 260000, 370000, 450000]
national    = [0, 0, 120000, 230000, 320000, 390000]
oneTime     = [120000, 0, 0, 0, 0, 0]   // truck 60k + trailer 15k + merch 15k + booth 30k
gAndA       = [150000, 320000, 580000, 880000, 1250000, 1650000]
// events[y]  = eventsBaseAnnual * eventYearFactor[y]   (see §3.6)
// memberships[y] = membershipsAnnual (sum of included org dues, §3.7), all years
eventYearFactor = [0.5, 1.0, 1.1, 1.21, 1.331, 1.4641]  // 2026 half-circuit, then +10%/yr
```

### 3.4 Staffing (FTE-years and avg base salary, per year)
```
CEO (founder)    FTE [0.42,1,1,1,1,1]      sal [150000,150000,175000,180000,185000,190000]
Engineering      FTE [0.83,3,5,7,9,11]     sal [70000,70000,140000,145000,150000,155000]
Sales            FTE [0,1,3,6,9,12]        sal [60000,60000,65000,70000,72000,74000]
Marketing        FTE [0.25,1,2,3,4,5]      sal [70000,70000,105000,110000,115000,120000]
Business Ops     FTE [0.25,1,2,3,4,5]      sal [70000,70000,105000,110000,115000,120000]
Customer Success FTE [0,1,2,4,6,8]         sal [60000,60000,70000,72000,74000,76000]
Ag Specialists   FTE [0,0.58,2,3,4,5]      sal [70000,70000,95000,100000,105000,110000]
benefitsLoad     = [0.10, 0.10, 0.28, 0.28, 0.28, 0.28]
```

### 3.5 Engine formulas (port exactly; per year y)
```
BOY[y]          = y==0 ? 0 : customersEOY[y-1] + presold[y-1]
churned[y]      = -BOY[y] * annualChurn[y]
adds[y]         = customersEOY[y] - BOY[y] - churned[y]
activeSeason[y] = BOY[y] + preSeasonCapture[y]*adds[y]
subRev[y]       = activeSeason[y] * subscriptionPerYear
txnRev[y]       = activeSeason[y] * avgGmvPerCustomer * takeRate * transactionCapture
recognizedRev[y]= subRev[y] + txnRev[y]
ach[y]          = -activeSeason[y] * jobsPerCustomerYear * achCostPerJob
platform[y]     = -activeSeason[y] * platformCogsPerCustomer
cogs[y]         = ach[y] + platform[y]
grossProfit[y]  = recognizedRev[y] + cogs[y]
baseSalaries[y] = Σ cat.FTE[y]*cat.sal[y]
benefits[y]     = baseSalaries[y] * benefitsLoad[y]
peopleCost[y]   = baseSalaries[y] + benefits[y]
totalFTE[y]     = Σ cat.FTE[y]
opexPeople[y]   = -peopleCost[y]
opexAi[y]       = -totalFTE[y] * layer1AiPerFtePerYear
opexComm[y]     = -(adds[y]+presold[y]) * salesCommissionPerNewCustomer
marketing[y]    = social[y]+digital[y]+events[y]+national[y]+memberships[y]+oneTime[y]
opexMkt[y]      = -marketing[y]
opexGna[y]      = -gAndA[y]
EBITDA[y]       = grossProfit[y] + opexPeople+opexAi+opexComm+opexMkt+opexGna
cumCash[y]      = y==0 ? EBITDA[0] : cumCash[y-1]+EBITDA[y]
ARR[y]          = customersEOY[y]*(subscriptionPerYear + avgGmvPerCustomer*takeRate*transactionCapture)
valuation       = ARR[5]*arrMultiple
newCust[y]      = adds[y]+presold[y]
acqSpend[y]     = marketing[y] + newCust[y]*salesCommissionPerNewCustomer
blendedCac[y]   = newCust[y]<=0 ? 0 : acqSpend[y]/newCust[y]
// Financing
postMoney = raiseAmount / dilution;  preMoney = postMoney - raiseAmount
investorStakeAtExit = dilution * valuation   // pre future-round dilution
moic = investorStakeAtExit / raiseAmount
```

### 3.5b Monthly engine (seasonalized; 72 months, y=0..5, m=1..12)
```
seasonal[m]  = [.05,.10,.35,1.50,2.40,1.80,2.40,1.80,.85,.50,.15,.10]   // sums to 12, avg 1.00
eventTiming[m] = [.0419,.1120,.1120,0,.1280,.0089,0,.0230,.3238,.1478,.0218,.0808] // sums to 1.0
fall2026[m]  = {8:.0385, 9:.5422, 10:.2475, 11:.0365, 12:.1353}  // 2026 events Aug-Dec only

Per (y,m):
  isLaunchMonth = y>0 OR m>=8           // 2026 spends nothing before Aug
  div           = y>0 ? 12 : 5          // 2026 fixed cost spread over Aug-Dec
  // revenue & variable cost follow the season:
  subM   = y>0 ? subRev[y]/12 : 0
  txnM   = y>0 ? txnRev[y]*seasonal[m]/12 : 0
  achM   = ach[y]*seasonal[m]/12        // (ach already negative)
  platM  = platform[y]/12
  jobsM  = y>0 ? activeSeason[y]*jobsPerCustomerYear*seasonal[m]/12 : 0
  // events land in real months:
  eventsM = y>0 ? -events[y]*eventTiming[m]
                : (m in fall2026 ? -events[0]*fall2026[m] : 0)
  oneTimeM = (y==0 && m in {8,9,10}) ? -oneTime[0]/3 : 0
  // fixed (even), masked for 2026 launch:
  if isLaunchMonth:
     peopleM = -peopleCost[y]/div
     aiM     = -totalFTE[y]*layer1AiPerFtePerYear/div
     commM   = opexComm[y]/div
     gnaM    = -gAndA[y]/div
     mktOtherM = y>0 ? -(social[y]+digital[y]+national[y])/12 - (m==1?memberships[y]:0)
                     : -(social[0]+digital[0]+national[0])/5 - (m==8?memberships[0]:0)
  else: all the above = 0
  netM   = subM+txnM + achM+platM+peopleM+aiM+commM+gnaM+eventsM+mktOtherM+oneTimeM
  cumM   = running sum across all 72 months
peakCashNeed = -min(cumM over all 72 months)
troughMonth  = argmin(cumM)
```
**Reconciliation invariant (unit-tested):** for each year, Σ of the 12 monthly `netM` == annual `EBITDA[y]`.

### 3.6 Event circuit — the 18 shows (name, cost, month). `eventsBaseAnnual` = Σ cost of included shows (all-Y default = 93752).
```
Nebraska Ag & Spray Drone Conference   2158  Aug  Top
Farm Progress Show                     7290  Sep  Top
Commercial UAV Expo Americas           8930  Sep  Strong
Husker Harvest Days                    6000  Sep  Strong
Farm Science Review                    8140  Sep  Strong
Ozark Fall Farmfest                    5000  Oct  Optional
Sunbelt Ag Expo                        8860  Oct  Strong
Colorado AAA Convention (CoAAA)        2044  Nov  Top
Western CO Farm & Ranch Innovation     2188  Feb  Top
NAAA Ag Aviation Expo                  7570  Dec  Top
National Western Stock Show            2641  Jan  Optional
Colorado Farm Show                     1291  Jan  Strong
Spray Drone End User Conf (SDEUC)      6600  Feb  Top
Ag Conference of the Southern Rockies  1708  Feb  Strong
Commodity Classic                      8640  Mar  Strong
Four States Ag Expo                    1862  Mar  Optional
XPONENTIAL (AUVSI)                    12000  May  Optional
CSU Wheat Field Days                    830  Jun  Optional
```

### 3.7 Orgs & boards — 12 memberships (name, annual dues, priority). `membershipsAnnual` = Σ dues of included (all-Y default = 2325).
```
Colorado Ag Aviation Assoc (CoAAA)        250  HIGH
NAAA + UAAS Committee                      450  HIGH
Rocky Mountain Agribusiness Assoc (RMAA)   350  HIGH
Colorado Farm Bureau                        60  HIGH
CDA Advisory Committees / Ag Commission      0  HIGH
Colorado Corn (Growers Assoc)               50  MED
Colorado Wheat (Wheat Growers)              50  MED
Colorado Weed Management Assoc (CWMA)       75  MED
Local Conservation District / NRCS           0  MED
Drone Service Providers Alliance (DSPA)    240  MED
Commercial Drone Alliance                  500  LOW
Certified Crop Adviser (CCA)               300  LOW
```

### 3.8 Market data (TAM/SAM/SOM) — from Chris's slide, verbatim
**SOURCE OF TRUTH = Chris's TAM/SAM/SOM slide ONLY. Do NOT use the market research document (`US_Agricultural_Service_Providers_Market` PDF/DOCX) for these figures.** All values live in `src/data/marketData.ts`; nothing hardcoded in JSX. Label the dollar figures **ARR** exactly as the slide does.

Headline (use as the page hero): **"Market is rapidly climbing — over $4B by 2030."**
```
TAM = $3.1B ARR / 86,500 entities — TOTAL US MARKET    — "All Large-Scale Ag Services"
SAM = $2.0B ARR / 50,000 entities — AVAILABLE MARKET   — "Across 8 separate ag-service verticals"
SOM = $450M ARR / 15,000 entities — OBTAINABLE MARKET  — "Our beachhead: Chemical Applicators"
Beachhead = Chemical applicators (drone + ground) — shown first / highlighted.
```
The slide presents three nested tiers (concentric circles: orange TAM → blue SAM → cream SOM) with leader lines to the entity counts and descriptors.

**How the numbers are derived — render this in plain language on the page (e.g., a `WhyThis` or caption under the funnel). Same formula at every tier:**
> Each business on Cloud Cowboy is worth a **$12,000/yr subscription + 2% of the job revenue** that runs through the platform. Multiply that per-business value by the number of businesses in each ring:
> - **TAM $3.1B** = all **86,500** US ag-service providers, if every one ran on Cloud Cowboy.
> - **SAM $2B** = the **~50,000** providers inside the **8 ag-service verticals** our platform serves.
> - **SOM $450M** = our beachhead — **~15,000 chemical-application businesses** we win first, at **~$30K each** ($12K subscription + 2% of ~$900K of jobs = $12K + $18K).
>
> The $30K/customer SOM unit is identical to the figure driving the finance model, so the Market page and the proforma reconcile.

**The slide does NOT itemize the 8 verticals with individual sizes/CAGR.** Do not invent per-vertical numbers for the funnel. Render the three tiers + the "8 verticals" count + the chemical-applicator beachhead, plus the derivation above.

### 3.8b Underlying market — 12 segments (SUPPORTING layer, not the funnel)
This is the **total market the funnel is derived from** — the dollars flowing through each ag-service vertical — NOT Cloud Cowboy's ARR. **Label it clearly as "Underlying US ag-services market — total industry revenue"** so it is never confused with the $3.1B ARR TAM. Source for the whole table: *Cloud Cowboy, US Agricultural Service Providers Market Analysis, March 2026, §3* (which itself cites USDA, 2022 Census of Ag, BLS, Grand View, Mordor, IBISWorld, NAAA). Put in `marketData.ts` as `segments[]` with `{name, revenue2025, cagr, entities, isBeachhead, source}`.
```
1  Chemical & Fertilizer Application   $18.2B  6.8%   11,200   <- BEACHHEAD (isBeachhead:true)
2  Agricultural Trucking & Transport   $15.3B  5.2%   10,500
3  Farm Labor & Staffing Services      $14.8B  12.7%  12,400
4  Livestock Support Services          $12.8B  7.9%   17,800
5  Custom Harvesting Services          $12.5B  5.5%    6,200
6  Precision Agriculture & Consulting   $6.9B  13.3%   5,800
7  Aerial Application Services          $5.8B  8.5%    2,400
8  Post-Harvest & Ginning Services      $5.6B  4.8%    5,100
9  Irrigation Services                  $4.2B  5.6%    1,900
10 Vineyard, Orchard & Specialty Crop   $3.4B  5.5%    3,800
11 Soil Preparation & Planting          $3.1B  n/a*    7,800
12 Agricultural Fencing Services        $1.7B  n/a*    1,600
TOTAL US ag-services market: $104.3B (2025) -> $140.3B (2030) at 5.8% composite CAGR.
* CAGR not stated in the source for segments 11-12; render "—", do not fabricate.
```
Relationship to the funnel (state this on the page): the $104.3B is the *industry*; Cloud Cowboy's **$3.1B TAM** is what we monetize from it ($12K subscription + 2% of transactions). Chemical & Fertilizer Application is both the largest segment and our beachhead.

### 3.9 Expected outputs (use as ENGINE_ROOM unit-test fixtures — base case, all toggles Y)
```
ARR[5]            = 60,000,000
valuation (20x)   = 1,200,000,000
EBITDA[1..5]      ≈ 238,766 / 1,226,879 / 5,896,555 / 15,700,699 / 31,531,527
EBITDA[0]         = -631,411
blendedCac[5]     ≈ 2,553
peakCashNeed      ≈ 797,227   troughMonth = "Mar 2027"
firstCfPositive   = 2028
postMoney/preMoney= 5,000,000 / 4,000,000   (raise 1,000,000 @ 20%)
```
Tolerance ±$50 for rounding.

---

## 4. Sprints

### Sprint `SADDLE_UP` — foundation, brand, shell
**Goal:** Data-room shell with on-brand nav (Market · Go-To-Market · Finance) behind the investor guard; shared design primitives. No business logic yet.
**Create/modify:**
- `src/pages/dataroom/DataRoomLayout.tsx` — tabbed shell reusing existing portal styling + logo + tagline.
- Routes for `/portal/market`, `/portal/gtm`, `/portal/finance` (placeholders) under the existing guard.
- `src/components/dataroom/` primitives: `StatTile`, `SectionCard`, `WhyThis` (collapsible narrative expander), `ToggleRow`, `ViewSwitch` (table/graph). Style from existing tokens.
**Tasks:**
- **Preflight (do first):** detect the package manager (npm/pnpm/yarn) from the lockfile and use it for all commands in this spec. Read `package.json`; ensure scripts exist for `typecheck` (add `"typecheck": "tsc --noEmit"` if missing), `build`, `lint`, and `test`. If no test runner is configured, add **Vitest** as a devDependency and a `"test": "vitest run"` script (needed by ENGINE_ROOM). Confirm `npm install` (or equivalent) succeeds before building.
- Confirm brand tokens from `tailwind.config` + existing components; build the shell; wire nav + active states (Framer Motion like existing); placeholder pages render the heading + a `WhyThis` stub.
**Acceptance:** all three routes reachable behind auth, on-brand, responsive; primitives exported and storybooked-by-usage on placeholders.
**Commit:** `feat(dataroom): SADDLE_UP`

### Sprint `ENGINE_ROOM` — the financial model in TypeScript
**Goal:** Pure, typed model engine + shared store. This powers Finance and is mutated by GTM toggles.
**Create:**
- `src/lib/model/data.ts` — all of §3 as typed constants (incl. events §3.6, orgs §3.7).
- `src/lib/model/types.ts` — `ModelInputs`, `ModelResult` (annual rows, 72-month arrays, metrics).
- `src/lib/model/engine.ts` — `compute(inputs): ModelResult` implementing §3.5 + §3.5b exactly.
- `src/lib/model/store.ts` — shared store: editable assumptions, `eventToggles`, `orgToggles`, `raiseAmount`, `dilution`; selectors that derive `eventsBaseAnnual`, `membershipsAnnual`, and memoized `compute()` result. Persist to `localStorage`.
- `src/lib/model/engine.test.ts` — assert §3.9 fixtures (Vitest).
**Acceptance:** `npm run test` passes all §3.9 fixtures incl. the monthly→annual reconciliation invariant.
**Commit:** `feat(dataroom): ENGINE_ROOM`

### Sprint `TERRITORY` — Market page
**Goal:** Top-to-bottom market story with the chemical-application beachhead front and center.
**Create:** `src/pages/dataroom/MarketPage.tsx`, `src/data/marketData.ts` (§3.8 + §3.8b), `src/components/dataroom/TamSamSomFunnel.tsx`, `SegmentTable.tsx`.
**Tasks:**
- **Hero + funnel (PRIMARY, from the slide §3.8):** headline "rapidly climbing over $4B by 2030"; nested TAM→SAM→SOM funnel (concentric circles, slide styling) showing **ARR** + entity counts + descriptors; chemical-applicator beachhead highlighted. Render the plain-language derivation (§3.8 "How the numbers are derived") as a `WhyThis`/caption.
- **Supporting segment table (SECONDARY, from §3.8b):** the 12-segment underlying-market table, **clearly labeled "Underlying US ag-services market — total industry revenue ($104.3B)"** and visually separated from the ARR funnel so the two are never conflated. Highlight Chemical & Fertilizer Application as the beachhead; each row shows revenue/CAGR/entities; "—" where CAGR is unstated. One source citation for the table.
- All figures pulled from `marketData.ts`; nothing hardcoded in JSX.
**Acceptance:** slide funnel renders the exact $3.1B/$2B/$450M ARR + 86,500/50,000/15,000 counts with the derivation; segment table renders all 12 with the $104.3B total and is labeled as the underlying market (not ARR); beachhead highlighted in both; no fabricated CAGRs.
**Commit:** `feat(dataroom): TERRITORY`

### Sprint `ROUNDUP` — Go-To-Market (Customer Discovery + Events + Orgs)
**Goal:** GTM page with three sub-tabs; Events/Orgs toggles drive the finance model live.
**Create/modify:** `src/pages/dataroom/GtmPage.tsx` with sub-tabs:
- **Customer Discovery** — rehome the existing CRM (map + table + 491 leads + drawers). Rename label to "Customer Discovery" everywhere user-facing; keep functionality.
- **Events** — list the 18 shows (§3.6) with `ToggleRow` Y/N each, showing cost, month, tier; a running "included circuit total" and "Δ to finance".
- **Orgs & Boards** — list the 12 orgs (§3.7) with Y/N each, showing dues + priority; running memberships total.
**Tasks:** toggles write to `store` (`eventToggles`/`orgToggles`); store recomputes `eventsBaseAnnual`/`membershipsAnnual` → `compute()` updates. Show an inline "this changes peak cash need / EBITDA" live readout so the finance link is visible on this page too.
**Acceptance:** toggling any event/org instantly changes the finance metrics (verify peakCashNeed moves); CRM still fully works under its new name.
**Commit:** `feat(dataroom): ROUNDUP`

### Sprint `WAR_ROOM` — Finance page (fully dynamic)
**Goal:** The interactive proforma. Table/graph toggle, filters, live assumptions, raise & valuation controls, returns.
**Create:** `src/pages/dataroom/FinancePage.tsx`, `components/dataroom/AssumptionPanel.tsx`, `FinanceTable.tsx`, `FinanceCharts.tsx`, `RaisePanel.tsx`.
**Tasks:**
- **ViewSwitch** between **Table** (annual P&L: customers→revenue→COGS→OpEx→EBITDA→cumulative→KEY METRICS incl. CAC; plus a monthly view) and **Graph**.
- **Graph view (Recharts):** ARR bars; **monthly cumulative-cash saw-tooth with the trough marked** (the spring-2027 low); revenue vs cost; CAC compression curve. Filter chips to show/hide series and pick year range.
- **AssumptionPanel:** live controls for customersEOY (per year), transactionCapture, churn, targetCac, avgGmv, arrMultiple, and the marketing scalars — recompute on change.
- **RaisePanel:** edit `raiseAmount` and either `dilution` or `postMoney` (derive the other); show pre/post, investor %, **peak cash need vs raise (runway/coverage)**, and **returns** (`investorStakeAtExit`, `moic`) at the live valuation. Defaults: raise $1,000,000 @ 20% → post $5,000,000 / pre $4,000,000.
- Everything reads from `store`/`compute()`; reflects Events/Orgs toggles from ROUNDUP.
- A "Reset to base case" button.
**Acceptance:** changing any control updates table + graphs live; raise/valuation math correct; with defaults the page shows ARR[5] $60M, valuation $1.2B, peak cash need ~$797K, raise $1M coverage readout; reconciles to §3.9.
**Commit:** `feat(dataroom): WAR_ROOM`

### Sprint `LAST_MILE` — narrative, polish, deploy
**Goal:** Inline storytelling + final QA.
**Tasks:** add `WhyThis` narrative (port the 12 sections from the proforma's "Story & Notes": thesis, how-to-read, ramp, recognized-vs-ARR, 100% capture, marketing/CAC, staffing/FTE, G&A, unit economics, seasonality/monthly cash, stress-test, sources) to the relevant pages; loading/empty states; mobile pass; a11y pass (focus, ARIA, contrast); brand QA against existing pages; ensure the existing CI deploy workflow ships it.
**Acceptance:** every page has contextual "why this"; mobile + a11y clean; production build deploys.
**Commit:** `feat(dataroom): LAST_MILE`

---

## 5. Guardrails
- Never fabricate market or finance numbers. Finance comes from §3; market comes from `marketData.ts` sourced from the research doc.
- Keep the engine pure and tested; UI must not duplicate formulas — always call `compute()`.
- Reuse existing brand, logo, auth, CRM, and map code. Extend, don't rebuild.
- Commit after each sprint with the exact message; keep PRs/branches per the repo's existing flow (staging → main).
