import pytest

from starter import sudoku_logic


def test_create_empty_board_has_correct_size():
    board = sudoku_logic.create_empty_board()

    assert len(board) == sudoku_logic.SIZE
    assert all(len(row) == sudoku_logic.SIZE for row in board)
    assert all(cell == sudoku_logic.EMPTY for row in board for cell in row)


def test_is_safe_detects_conflicts():
    board = sudoku_logic.create_empty_board()
    board[0][0] = 1
    board[0][1] = 2

    assert sudoku_logic.is_safe(board, 0, 2, 3)
    assert not sudoku_logic.is_safe(board, 0, 1, 2)


def test_generate_puzzle_returns_valid_puzzle_and_solution():
    puzzle, solution = sudoku_logic.generate_puzzle(clues=35)

    assert isinstance(puzzle, list)
    assert isinstance(solution, list)
    assert len(puzzle) == sudoku_logic.SIZE
    assert len(solution) == sudoku_logic.SIZE
    assert all(len(row) == sudoku_logic.SIZE for row in puzzle)
    assert all(len(row) == sudoku_logic.SIZE for row in solution)

    for row in range(sudoku_logic.SIZE):
        for col in range(sudoku_logic.SIZE):
            if puzzle[row][col] != sudoku_logic.EMPTY:
                assert puzzle[row][col] == solution[row][col]


def test_generate_puzzle_has_unique_solution_shape():
    puzzle, solution = sudoku_logic.generate_puzzle(clues=40)

    assert puzzle != solution
    assert puzzle != [[0] * sudoku_logic.SIZE for _ in range(sudoku_logic.SIZE)]


def test_count_solutions_returns_one_for_unique_puzzle():
    puzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]

    assert sudoku_logic.count_solutions(puzzle, limit=2) == 1


def test_count_solutions_returns_two_for_ambiguous_puzzle():
    puzzle = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    assert sudoku_logic.count_solutions(puzzle, limit=2) == 2


def test_count_solutions_returns_zero_for_invalid_puzzle():
    puzzle = sudoku_logic.create_empty_board()
    puzzle[0][0] = 1
    puzzle[0][1] = 1

    assert sudoku_logic.count_solutions(puzzle, limit=2) == 0


def test_generate_puzzle_has_exact_number_of_unique_clues():
    clues = 35
    puzzle, _ = sudoku_logic.generate_puzzle(clues=clues)

    assert sum(1 for row in puzzle for cell in row if cell != sudoku_logic.EMPTY) == clues
    assert sudoku_logic.count_solutions(puzzle, limit=2) == 1





