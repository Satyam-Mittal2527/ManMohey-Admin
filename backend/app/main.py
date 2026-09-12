from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes import (
    products,
    categories,
    filter_groups,
    filter_options,
    customers,
    orders,
    user_routes,
)


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
    allow_origins=[
        "https://man-mohey-admin.vercel.app",
        "http://localhost:5173",
    ],
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

app.include_router(
    customers.router,
    prefix="/api/customers",
    tags=["Customers"],
)

app.include_router(orders.router)

app.include_router(
    user_routes.router,
    prefix="/api/auth",
    tags=["Authentication"],
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