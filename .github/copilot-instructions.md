# Copilot Instructions for AI Coding Agents

## Project Overview
- This is a React flashcard app bootstrapped with Create React App.
- Main source code is in `src/`, with core logic in `App.js` and UI components in `src/components/`.
- Flashcard data is stored in `src/flashcards.json` and loaded at runtime.
- Styling uses Tailwind CSS (`tailwind.config.js`, `postcss.config.js`).

## Architecture & Data Flow
- The app displays flashcards, each with a title, description, and optionally a pattern explanation (markdown/ASCII diagrams).
- `App.js` manages flashcard state and navigation.
- `Flashcard.js` renders individual cards, including markdown explanations if present.
- Images and external links are supported for explanations and example problems.

## Developer Workflows
- **Start dev server:** `npm start` (hot reload, runs on localhost:3000)
- **Run tests:** `npm test` (Jest, Testing Library)
- **Build for production:** `npm run build` (outputs to `build/`)
- **Deploy to GitHub Pages:** `npm run deploy` (uses `gh-pages`)
- **Linting:** ESLint config is in `package.json` under `eslintConfig`.

## Project-Specific Patterns
- Flashcard explanations use markdown and ASCII diagrams for clarity; render with `<pre>` or markdown renderer.
- Card flipping is managed via React state in `Flashcard.js`.
- All flashcard data is static and loaded from JSON; no backend or API calls.
- Only public npm packages are used; no private registries.

## Integration Points
- External links for example problems (LeetCode) and images for explanations.
- Tailwind CSS for styling; see config files for customizations.

## Key Files & Directories
- `src/flashcards.json`: Flashcard data, including explanations.
- `src/components/Flashcard.js`: Card rendering logic, including markdown/ASCII support.
- `src/App.js`: Main app logic and state management.
- `tailwind.config.js`, `postcss.config.js`: Styling setup.
- `package.json`: Scripts, dependencies, and lint config.

## Example Patterns
- To add a new flashcard, update `src/flashcards.json` and ensure `patternExplanation` uses markdown/ASCII for diagrams.
- To display new fields, update `Flashcard.js` to render them appropriately.

## Conventions
- Prefer functional React components and hooks.
- Use Tailwind utility classes for styling.
- Keep flashcard explanations compact and suitable for markdown/terminal display.

---

_If any section is unclear or missing, please request clarification or provide feedback for improvement._

## Pull Request Review Guidelines
- Use short, direct comments: `diff`, `copy`, `edit`.
- Always comment on:
  - Variable naming
  - Style issue
  - Missed edge cases
- Comment even if unsure — I will decide what to ignore.
- Use `copilot-ignore` to exclude non-relevant sections and help Copilot focus on critical code.
- Example:
  - `diff: Variable name unclear`
  - `edit: Missed null check`
  - `copy: Good use of React hooks`
