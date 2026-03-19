import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import main
from main import WatchStore, app


@pytest.fixture()
def client(tmp_path: Path):
    data_file = tmp_path / "watches.json"
    data_file.write_text(
        json.dumps(
            [
                {
                    "id": 1,
                    "name": "Test Watch",
                    "brand": "Chronos",
                    "price": 1000,
                    "style": "Dress",
                    "movement": "Automatic",
                    "stock": 2,
                    "imageUrl": "https://example.com/watch.jpg",
                    "description": "A reliable dress watch for integration testing.",
                    "material": "Steel",
                    "strap": "Leather strap",
                    "waterResistance": "50m",
                    "featured": False,
                    "altText": "Dress watch with white dial and black leather strap"
                }
            ]
        )
    )
    original_store = main.store
    main.store = WatchStore(data_file)
    with TestClient(app) as test_client:
        yield test_client
    main.store = original_store


def test_health(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_watches(client: TestClient):
    response = client.get("/watches")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_create_update_delete_watch(client: TestClient):
    payload = {
        "name": "Regatta",
        "brand": "Marine",
        "price": 2200,
        "style": "Sport",
        "movement": "Automatic",
        "stock": 5,
        "imageUrl": "https://example.com/regatta.jpg",
        "description": "A sport watch with strong lume and marine timing cues.",
        "material": "Titanium",
        "strap": "Rubber strap",
        "waterResistance": "200m",
        "featured": True,
        "altText": "Sport watch with blue dial and rubber strap"
    }

    create_response = client.post("/watches", json=payload)
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["id"] == 2

    update_response = client.put(
        f"/watches/{created['id']}",
        json={**payload, "stock": 1, "name": "Regatta Updated"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["stock"] == 1

    delete_response = client.delete(f"/watches/{created['id']}")
    assert delete_response.status_code == 204

    not_found_response = client.get(f"/watches/{created['id']}")
    assert not_found_response.status_code == 404


def test_validation_error(client: TestClient):
    response = client.post(
        "/watches",
        json={
            "name": "X",
            "brand": "Y",
            "price": -1,
            "style": "",
            "movement": "",
            "stock": -5,
            "imageUrl": "not-a-url",
            "description": "short",
            "material": "",
            "strap": "",
            "waterResistance": "",
            "featured": False,
            "altText": "bad"
        },
    )
    assert response.status_code == 422
