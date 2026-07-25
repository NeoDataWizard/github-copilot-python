import copy
import random

SIZE = 9
EMPTY = 0
MAX_GENERATION_ATTEMPTS = 3

def deep_copy(board):
    return copy.deepcopy(board)

def create_empty_board():
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]

def is_safe(board, row, col, num):
    # Check row and column
    for x in range(SIZE):
        if board[row][x] == num or board[x][col] == num:
            return False
    # Check 3x3 box
    start_row = row - row % 3
    start_col = col - col % 3
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True

def fill_board(board):
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                possible = list(range(1, SIZE + 1))
                random.shuffle(possible)
                for candidate in possible:
                    if is_safe(board, row, col, candidate):
                        board[row][col] = candidate
                        if fill_board(board):
                            return True
                        board[row][col] = EMPTY
                return False
    return True

def count_solutions(board, limit=2):
    board_copy = deep_copy(board)
    solution_count = [0]

    # Validate the given board before searching.
    for row in range(SIZE):
        for col in range(SIZE):
            value = board_copy[row][col]
            if value != EMPTY:
                board_copy[row][col] = EMPTY
                if not is_safe(board_copy, row, col, value):
                    return 0
                board_copy[row][col] = value

    def backtrack():
        if solution_count[0] >= limit:
            return

        empty_cell = None
        for row in range(SIZE):
            for col in range(SIZE):
                if board_copy[row][col] == EMPTY:
                    empty_cell = (row, col)
                    break
            if empty_cell is not None:
                break

        if empty_cell is None:
            solution_count[0] += 1
            return

        row, col = empty_cell
        for candidate in range(1, SIZE + 1):
            if is_safe(board_copy, row, col, candidate):
                board_copy[row][col] = candidate
                backtrack()
                board_copy[row][col] = EMPTY
                if solution_count[0] >= limit:
                    return

    backtrack()
    return min(solution_count[0], limit)

def remove_cells(board, clues):
    positions = [(row, col) for row in range(SIZE) for col in range(SIZE)]
    random.shuffle(positions)
    current_clues = SIZE * SIZE

    for row, col in positions:
        if current_clues <= clues:
            break
        if board[row][col] == EMPTY:
            continue

        saved_value = board[row][col]
        board[row][col] = EMPTY
        if count_solutions(board, limit=2) == 1:
            current_clues -= 1
        else:
            board[row][col] = saved_value

    return current_clues == clues

def generate_puzzle(clues=35):
    for attempt in range(MAX_GENERATION_ATTEMPTS):
        board = create_empty_board()
        fill_board(board)
        solution = deep_copy(board)
        puzzle = deep_copy(board)

        if remove_cells(puzzle, clues):
            return puzzle, solution

    raise RuntimeError(
        f'Could not generate a unique Sudoku puzzle with {clues} clues ' \
        f'within {MAX_GENERATION_ATTEMPTS} attempts.'
    )
