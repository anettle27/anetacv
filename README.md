# Aneta Vostrá — CV

A playful static web resume with tabs (Home, Education, Experience, Projects). No build step.

- `index.html` — English content (the rotating home-page lines are in the `phrases` list)
- `cs/index.html` — Czech version; keep it in sync when editing the English page
- `styles.css` — styling and colour palette (variables at the top)
- `script.js` — switches tabs based on the URL (`#education`, `#projects`, …)

Every push to `main` deploys to https://aneta.vostry.org via Vercel.
