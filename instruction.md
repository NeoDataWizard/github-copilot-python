# GitHub Copilot Instructions – Sudoku Refactor

## Project Context

This project is a Python Flask Sudoku application. GitHub Copilot should assist with refactoring the legacy application while preserving existing functionality and improving code quality, maintainability, accessibility, and user experience.

## Code Style and Structure

- Follow PEP 8 conventions for Python code.
- Keep Python code readable, modular, and maintainable.
- Keep Sudoku game logic in `starter/sudoku_logic.py`.
- Keep Flask routes and request handling in `starter/app.py`.
- Keep frontend JavaScript in `starter/static/main.js`.
- Keep styling in `starter/static/styles.css`.
- Keep HTML structure in `starter/templates/index.html`.
- Avoid unnecessary changes outside the Sudoku application.
- Prefer small, incremental changes instead of large rewrites.

## Sudoku Requirements

- Generate valid Sudoku puzzles with exactly one unique solution.
- Support Easy, Medium, and Hard difficulty levels.
- Preserve locked prefilled cells.
- Provide immediate feedback for invalid moves.
- Provide a Hint feature that fills one correct empty cell.
- Lock cells filled using hints.
- Provide a Check Puzzle feature for validating the board.
- Maintain a timer for each game.
- Maintain a Top 10 leaderboard using browser localStorage.
- Store player name, completion time, difficulty, and hints used.

## UI and Accessibility

- Support both light and dark modes.
- Use visually distinct alternating 3x3 Sudoku regions.
- Keep the interface responsive for desktop and mobile devices.
- Use semantic HTML where appropriate.
- Ensure controls remain keyboard accessible.
- Provide clear visual feedback without relying only on color.

## Error Handling

- Handle invalid input gracefully.
- Display useful user-facing error messages.
- Avoid exposing internal exceptions to users.
- Preserve the existing game flow when handling errors.

## Testing

- Add or update automated tests when changing important functionality.
- Test puzzle generation and unique-solution validation.
- Test difficulty selection.
- Test Flask API endpoints.
- Keep existing passing tests working.
- Do not remove tests merely to make the test suite pass.

## Copilot Working Guidelines

Before modifying code, inspect the existing implementation and understand its behavior.

Do not rewrite stable functionality unless required for correctness or maintainability.

When proposing significant changes, explain the intended approach before implementation.

Prefer simple and maintainable solutions over unnecessary complexity.

Preserve backward compatibility with the existing Sudoku game wherever possible.