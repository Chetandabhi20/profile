# Practical 8 — Performance Comparison: Before vs After Lazy Loading

## Optimization Applied

Route-based code splitting using `React.lazy()` and `<Suspense>` on 6 route
components: Home, Projects, Tasks, Contact, Login, NotFound.

---

## Build Output Comparison

### BEFORE Optimization (Single Bundle)

```
vite v8.1.5 building client environment for production...
✓ 42 modules transformed.

dist/index.html                   0.78 kB │ gzip:  0.43 kB
dist/assets/index-CnEX4H7V.css  25.40 kB │ gzip:  4.75 kB
dist/assets/index-V8S1uqSl.js  258.71 kB │ gzip: 80.72 kB

✓ built in 1.27s
```

**Chunk count:** 1 JavaScript bundle  
**Initial JS download:** 258.71 kB (80.72 kB gzipped)

### AFTER Optimization (Code-Split)

```
vite v8.1.5 building client environment for production...
✓ 43 modules transformed.

dist/index.html                         0.78 kB │ gzip:  0.43 kB
dist/assets/index-CnEX4H7V.css        25.40 kB │ gzip:  4.75 kB
dist/assets/NotFound-CI82wm-R.js        0.40 kB │ gzip:  0.29 kB
dist/assets/Contact-7GQL4a76.js         1.48 kB │ gzip:  0.72 kB
dist/assets/ErrorMessage-Sv5i62co.js    2.64 kB │ gzip:  0.58 kB
dist/assets/Projects-D1GpVOzK.js        3.04 kB │ gzip:  1.08 kB
dist/assets/Login-yzDqpPlv.js           3.58 kB │ gzip:  1.02 kB
dist/assets/Home-DVZ1xbLk.js            3.77 kB │ gzip:  1.25 kB
dist/assets/Tasks-CsQJo9Bj.js           7.14 kB │ gzip:  2.15 kB
dist/assets/index-BjgRUWGi.js         240.50 kB │ gzip: 77.07 kB

✓ built in 1.28s
```

**Chunk count:** 8 JavaScript bundles (1 main + 7 lazy chunks)  
**Initial JS download:** 240.50 kB (77.07 kB gzipped)

---

## Side-by-Side Metrics

| Metric                      | Before         | After          | Improvement       |
|-----------------------------|----------------|----------------|-------------------|
| **JS files generated**      | 1              | 8              | 7 separate chunks |
| **Initial bundle size**     | 258.71 kB      | 240.50 kB      | -18.21 kB (−7.0%) |
| **Initial gzipped**         | 80.72 kB       | 77.07 kB       | -3.65 kB (−4.5%)  |
| **Modules transformed**     | 42             | 43             | +1 (LazyFallback) |
| **Total JS (all chunks)**   | 258.71 kB      | 262.55 kB      | +3.84 kB overhead |

---

## Key Observations

1. **Initial load reduced by 18.21 kB (7.0%)**  
   The main `index.js` bundle dropped from 258.71 kB to 240.50 kB because
   route-specific code was extracted into separate chunks.

2. **7 separate chunk files generated**  
   Each lazy-loaded route (plus a shared `ErrorMessage` dependency) now has
   its own `.js` file that the browser downloads only when needed.

3. **Total download stays roughly the same**  
   If a user visits every route in one session, the total JS downloaded is
   262.55 kB — only ~3.84 kB more than before (due to Webpack/Vite chunk
   wrapper overhead). Lazy loading delays *when* code downloads, not *how
   much* code downloads.

4. **Perceived performance improves**  
   - First Contentful Paint (FCP) is faster because the browser parses less
     JS on initial load.  
   - Users who only visit 1–2 routes never download code for routes they
     don't use.

5. **Trade-off: slight navigation delay on first visit**  
   The first time a user navigates to a lazy route, there's a brief network
   fetch for its chunk. The `<LazyFallback />` component renders during this
   window. On fast connections, this is imperceptible; on Slow 3G, the
   terminal-styled loading animation is clearly visible.

---

## How to Verify (DevTools Network Tab)

1. Open Chrome DevTools → **Network** tab  
2. Check **Disable cache** checkbox  
3. Set throttling to **Slow 3G** (to see fallback UI clearly)  
4. Load the app at `/` → observe `index-*.js` and `Home-*.js` loading  
5. Navigate to `/projects` → observe `Projects-*.js` chunk fetched on demand  
6. Navigate to `/contact` → observe `Contact-*.js` chunk fetched on demand  
7. Each chunk loads only once; subsequent visits serve from cache  

---

## Architecture Diagram

```
BEFORE (single bundle):
  main.bundle.js ────────────► [Home][Projects][Tasks][Contact][Login][NotFound]
                                 ALL loaded upfront on first page visit

AFTER (code-split):
  index-*.js     ────────────► App shell (Header, NavBar, Footer, Router, api.js)
  Home-*.js      ────────────► Loaded only when /         is visited
  Projects-*.js  ────────────► Loaded only when /projects is visited
  Tasks-*.js     ────────────► Loaded only when /tasks    is visited
  Contact-*.js   ────────────► Loaded only when /contact  is visited
  Login-*.js     ────────────► Loaded only when /login    is visited
  NotFound-*.js  ────────────► Loaded only when invalid route is visited
```

---

*Document generated for Practical 8 — Performance Optimization and Lazy Loading*  
*Student: Chetan Dabhi*
