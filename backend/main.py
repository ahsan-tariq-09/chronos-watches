from __future__ import annotations

import json
import os
import threading
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field, HttpUrl

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "watches.json"
SITE_CONTENT_FILE = BASE_DIR / "site_content.json"
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

file_lock = threading.Lock()


class WatchBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    brand: str = Field(..., min_length=2, max_length=120)
    price: float = Field(..., gt=0)
    style: str = Field(..., min_length=2, max_length=80)
    movement: str = Field(..., min_length=2, max_length=80)
    stock: int = Field(..., ge=0)
    imageUrl: HttpUrl
    description: str = Field(..., min_length=10, max_length=1200)
    material: str = Field(..., min_length=2, max_length=80)
    strap: str = Field(..., min_length=2, max_length=80)
    waterResistance: str = Field(..., min_length=2, max_length=80)
    featured: bool = False
    altText: str = Field(..., min_length=10, max_length=220)


class WatchCreate(WatchBase):
    pass


class Watch(WatchBase):
    id: int = Field(..., ge=1)
    model_config = ConfigDict(from_attributes=True)


class HealthResponse(BaseModel):
    status: str


class HighlightItem(BaseModel):
    id: str = Field(..., min_length=2, max_length=80)
    title: str = Field(..., min_length=2, max_length=120)
    description: str = Field(..., min_length=10, max_length=300)


class HomeHero(BaseModel):
    eyebrow: str = Field(..., min_length=2, max_length=80)
    title: str = Field(..., min_length=2, max_length=160)
    subtitle: str = Field(..., min_length=10, max_length=400)
    primaryCtaLabel: str = Field(..., min_length=2, max_length=40)
    secondaryCtaLabel: str = Field(..., min_length=2, max_length=40)


class HomepageContent(BaseModel):
    hero: HomeHero
    highlights: list[HighlightItem]
    featuredSectionTitle: str = Field(..., min_length=2, max_length=120)
    catalogSectionTitle: str = Field(..., min_length=2, max_length=120)


class CheckoutContent(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    subtitle: str = Field(..., min_length=10, max_length=300)
    notice: str = Field(..., min_length=10, max_length=400)
    supportEmail: str = Field(..., min_length=5, max_length=120)
    shippingLabel: str = Field(..., min_length=2, max_length=80)
    shippingCost: float = Field(..., ge=0)
    taxRate: float = Field(..., ge=0, le=1)
    allowOrderNotes: bool = True


class SiteContent(BaseModel):
    homepage: HomepageContent
    checkout: CheckoutContent


class WatchStore:
    def __init__(self, data_file: Path):
        self.data_file = data_file
        self._ensure_file()

    def _ensure_file(self) -> None:
        if not self.data_file.exists():
            self.data_file.write_text("[]\n", encoding="utf-8")

    def read_all(self) -> List[Watch]:
        with file_lock:
            try:
                payload = json.loads(self.data_file.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Storage file is corrupted.",
                ) from exc

        if not isinstance(payload, list):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Storage file contains invalid data.",
            )

        return [Watch.model_validate(item) for item in payload]

    def write_all(self, watches: List[Watch]) -> None:
        serialised = [watch.model_dump(mode="json") for watch in watches]
        with file_lock:
            self.data_file.write_text(
                json.dumps(serialised, indent=2) + "\n",
                encoding="utf-8",
            )


def read_site_content() -> SiteContent:
    if not SITE_CONTENT_FILE.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Site content file is missing.",
        )

    try:
        payload = json.loads(SITE_CONTENT_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Site content file is corrupted.",
        ) from exc

    return SiteContent.model_validate(payload)


store = WatchStore(DATA_FILE)

app = FastAPI(title="Chronos Watches API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/watches", response_model=List[Watch])
def get_watches() -> List[Watch]:
    return store.read_all()


@app.get("/site-content", response_model=SiteContent)
def get_site_content() -> SiteContent:
    return read_site_content()


@app.get("/watches/{watch_id}", response_model=Watch)
def get_watch(watch_id: int) -> Watch:
    watches = store.read_all()
    watch = next((item for item in watches if item.id == watch_id), None)
    if watch is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watch not found.",
        )
    return watch


@app.post("/watches", response_model=Watch, status_code=status.HTTP_201_CREATED)
def create_watch(payload: WatchCreate) -> Watch:
    watches = store.read_all()
    next_id = max((watch.id for watch in watches), default=0) + 1
    watch = Watch(id=next_id, **payload.model_dump())
    watches.append(watch)
    store.write_all(watches)
    return watch


@app.put("/watches/{watch_id}", response_model=Watch)
def update_watch(watch_id: int, payload: WatchCreate) -> Watch:
    watches = store.read_all()
    for index, watch in enumerate(watches):
        if watch.id == watch_id:
            updated = Watch(id=watch_id, **payload.model_dump())
            watches[index] = updated
            store.write_all(watches)
            return updated

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Watch not found.",
    )


@app.delete("/watches/{watch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_watch(watch_id: int) -> Response:
    watches = store.read_all()
    remaining = [watch for watch in watches if watch.id != watch_id]

    if len(remaining) == len(watches):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watch not found.",
        )

    store.write_all(remaining)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")