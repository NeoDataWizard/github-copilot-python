import pytest

from starter import app as app_module


@pytest.fixture
def client():
    app_module.app.config['TESTING'] = True
    with app_module.app.test_client() as client:
        yield client


def test_index_route_returns_page(client):
    response = client.get('/')

    assert response.status_code == 200
    assert b'<!' in response.data


def test_new_game_route_returns_puzzle(client):
    response = client.get('/new?clues=35')

    assert response.status_code == 200
    data = response.get_json()
    assert 'puzzle' in data
    assert len(data['puzzle']) == 9
    assert all(len(row) == 9 for row in data['puzzle'])


def test_check_solution_route_reports_incorrect_cells(client):
    app_module.CURRENT['solution'] = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8],
    ]

    payload = {'board': [[0] * 9 for _ in range(9)]}
    response = client.post('/check', json=payload)

    assert response.status_code == 200
    data = response.get_json()
    assert len(data['incorrect']) == 81


def test_check_solution_route_returns_error_when_no_game(client):
    app_module.CURRENT['solution'] = None
    response = client.post('/check', json={'board': []})

    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
