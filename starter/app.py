from flask import Flask, render_template, jsonify, request
import sudoku_logic

app = Flask(__name__)

# Keep a simple in-memory store for current puzzle and solution
CURRENT = {
    'puzzle': None,
    'solution': None
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new')
def new_game():
    clues = int(request.args.get('clues', 35))
    puzzle, solution = sudoku_logic.generate_puzzle(clues)
    CURRENT['puzzle'] = puzzle
    CURRENT['solution'] = solution
    return jsonify({'puzzle': puzzle})

@app.route('/hint', methods=['POST'])
def get_hint():
    data = request.json or {}
    board = data.get('board')
    solution = CURRENT.get('solution')
    if solution is None:
        return jsonify({'error': 'No game in progress'}), 400
    if not isinstance(board, list) or len(board) != sudoku_logic.SIZE:
        return jsonify({'error': 'Invalid board'}), 400

    for row in range(sudoku_logic.SIZE):
        for col in range(sudoku_logic.SIZE):
            if board[row][col] == 0:
                updated_board = [list(row_values) for row_values in board]
                updated_board[row][col] = solution[row][col]
                return jsonify({
                    'row': row,
                    'col': col,
                    'value': solution[row][col],
                    'board': updated_board,
                })
    return jsonify({'message': 'No empty cells available'})


@app.route('/check', methods=['POST'])
def check_solution():
    data = request.json
    board = data.get('board')
    solution = CURRENT.get('solution')
    if solution is None:
        return jsonify({'error': 'No game in progress'}), 400
    incorrect = []
    for i in range(sudoku_logic.SIZE):
        for j in range(sudoku_logic.SIZE):
            if board[i][j] != solution[i][j]:
                incorrect.append([i, j])
    return jsonify({'incorrect': incorrect})

if __name__ == '__main__':
    app.run(debug=True)