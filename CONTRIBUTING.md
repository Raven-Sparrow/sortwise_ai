# Contributing to SortWise AI Waste Sorter

Thank you for your interest in contributing to Sortwise! This guide outlines the workflow and standards we follow to build privacy-first, edge-powered waste categorization tools.

## Development Setup

1. **Prerequisites**: Ensure you have Node.js (v18+) and npm installed.
2. **Installation**:
   ```bash
   npm install
   ```
3. **Local Dev Server**:
   ```bash
   npm run dev
   ```
4. **Production Build Testing**:
   ```bash
   npm run build
   ```

## Contribution Process

1. **Fork the Repository**: Clone your fork locally.
2. **Create a Feature Branch**: Use descriptive names like `feature/new-model-rules` or `bugfix/camera-aspect-ratio`.
3. **Commit Guidelines**:
   - Write clear, imperative commits: `Feat: add aluminum foil rules to waste classifier` or `Fix: handle WebGL errors on iOS browsers`.
4. **Validation Checklists**:
   - Run `npm run lint` (`oxlint`) to verify syntax compliance.
   - Run a test build to ensure no chunk loading errors.
5. **Open a Pull Request**: Submit your PR against our `main` branch. Provide detailed reproduction steps or design context in the PR description template.

## Modifying ML Mappings & Rules

The core intelligence of the triple-model classifier is configured inside:
- [imagenetWasteMap.js](file:///src/lib/imagenetWasteMap.js): Direct lookup dictionaries matching raw ImageNet classes to waste streams.
- [wasteMapping.js](file:///src/lib/wasteMapping.js): Weight-based keyword parsing logic.
- [materialMap.js](file:///src/lib/materialMap.js): COCO-SSD bounding box class conversions.

To add new waste rules:
1. Identify the corresponding ImageNet-1000 class names outputted by MobileNetV2.
2. Map the label inside `imagenetWasteMap.js` or define keywords in `wasteMapping.js`.
3. Test your changes by loading custom photos of target items in the local dev server.

Thank you for contributing to a cleaner, greener planet! 💚
