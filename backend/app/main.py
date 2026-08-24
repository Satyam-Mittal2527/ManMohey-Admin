from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes import products, categories, filter_groups, filter_options


app = FastAPI(
    title="ManMohey Admin API",
    version="1.0.0",
    description="API for ManMohey Admin Panel",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(
    products.router,
    prefix="/api/products",
    tags=["Products"],
)

app.include_router(
    categories.router,
    prefix="/api/categories",
    tags=["Categories"],
)

app.include_router(
    filter_options.router,
    prefix="/api/filter-options",
    tags=["Filter Options"],
)

app.include_router(
    filter_groups.router,
    prefix="/api/filter-groups",
    tags=["Filter Groups"],
)
# ============================================================
# Static Files
# ============================================================

app.mount(
    "/public",
    StaticFiles(directory="public"),
    name="public",
)


# ============================================================
# Health Check
# ============================================================

@app.get("/")
def root():
    return {
        "message": "ManMohey Admin API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }