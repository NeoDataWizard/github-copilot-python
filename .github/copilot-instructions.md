# GitHub Copilot Instructions for Sudoku Refactor

This repository contains a legacy Python Flask Sudoku web app in `starter/`. Refactor the app while preserving its existing functionality and add the requested features in a clean, maintainable way.

## Core requirements

- Keep Python code clean, readable, and maintainable following PEP 8.
- Use modular, reusable components in both Python and JavaScript.
- Implement clear error handling with helpful user-facing messages and comments.
- Preserve existing app behavior while refactoring; do not remove or break current Sudoku game flow.

## Sudoku game behavior

- Generate Sudoku puzzles with exactly one unique solution.
- Support three difficulty levels: Easy, Medium, Hard.
- Use locked, prefilled cells for the initial puzzle state.
- Provide immediate visual feedback for invalid moves.
- Implement a Hint feature that fills one correct empty cell and locks that cell.
- Implement a Check feature that validates the current board state.

## UI and experience

- Add a timer that starts when a new puzzle begins.
- Create a Top 10 leaderboard stored in `localStorage`.
- Save player name, completion time, difficulty, and hints used in leaderboard entries.
- Provide light and dark mode themes.
- Make the app responsive on desktop and mobile.
- Use alternating styling for 3x3 Sudoku blocks.
- Ensure HTML and controls are accessible with semantic markup and keyboard-friendly interaction.

## Implementation guidance

- Keep logic in `starter/sudoku_logic.py` and routing in `starter/app.py`.
- Keep UI code in `starter/templates/index.html`, `starter/static/main.js`, and `starter/static/styles.css`.
- Avoid unrelated changes outside the Sudoku app scope.
- Prefer simple, maintainable solutions over overly complex rewrites.

## Testing

- Add or update tests after major refactors.
- Include tests for puzzle generation, unique solution validation, difficulty selection, and API endpoints.
- Prefer automated unit tests and keep them easy to run.

## Delivery expectations

- Use clear comments for nontrivial logic.
- Keep feature changes small and incremental.
- Preserve existing game flow and behavior while improving structure and UX.
- Ensure the final app is stable, maintainable, and works in modern browsers.