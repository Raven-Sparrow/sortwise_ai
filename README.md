# Sortwise — AI Waste Sorting Scanner

Built for **Idea2Impact 2026 · Theme 2: Clean & Green Technology**

Sortwise looks at a photo of any household item and tells you which bin it belongs in —
**recyclable, compost, landfill, or hazardous** — with the reasoning shown, not hidden.

**Live demo:** _add your deployed URL here after step 3 below_

## Why this counts as real AI, not a wrapper

- Runs **MobileNetV2**, a convolutional neural network, via TensorFlow.js — entirely in the
  browser, on-device. No API calls, no backend, no external inference service.
- The CNN was trained on general object recognition (ImageNet), not trash — so `src/lib/wasteMapping.js`
  is the actual domain-specific intelligence layer: it interprets the network's top-5 predictions
  through a weighted keyword-to-waste-stream model built around Indian municipal bin categories
  (blue/dry, green/wet, black/reject, red/hazardous).
- The full model output (raw class names + confidence per prediction) is shown to the user under
  "Model output" — nothing is hidden, so it's easy to verify the AI is actually doing the work.

## Tech stack

React 19 · Vite · Tailwind CSS · TensorFlow.js · `@tensorflow-models/mobilenet`

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL. Allow camera access if you want to scan live instead of uploading a photo.

## Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## Deploy (free, ~3 minutes) — Vercel

1. Push this folder to a **public GitHub repo**.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import that repo.
3. Framework preset: **Vite** (auto-detected). Leave build command (`npm run build`) and output
   directory (`dist`) as-is. Click **Deploy**.
4. You'll get a live `https://your-project.vercel.app` URL — put that in your submission form and
   in the "Live demo" line above.

### Alternative: Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Build command: `npm run build`, publish directory: `dist`. Deploy.

## Project structure

```
src/
  components/       UI components (scan interface, conveyor-belt sort animation, results, stats)
  lib/
    useWasteModel.js   loads TF.js + MobileNet, exposes classify()
    wasteMapping.js    the decision engine — CNN predictions → waste category
    impact.js          session impact-estimate math
```

## Notes for the submission doc

- **Problem:** Household and small-business waste sorting is inconsistent because most people don't
  reliably know which stream an item belongs to, which contaminates recycling and compost batches
  and increases landfill load.
- **Approach:** On-device computer vision removes the friction of "look it up" — point a camera,
  get an instant, explainable answer, with zero data leaving the device (also makes it usable
  offline-first after the model caches).
- **Honest limitation to mention in your problem statement:** MobileNet's training set is general
  objects, not a purpose-built trash dataset — so the mapping layer is heuristic, not a fine-tuned
  classifier. Framing this as v1 with a clear path to a fine-tuned model (e.g. via TrashNet or a
  custom labeled dataset) is a good "future work" line for judges.
