from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, bundles, projects, history
from routers.admin import auth as admin_auth, users as admin_users, stats as admin_stats

app = FastAPI(
    title="CDC-Gen API",
    description="Backend FastAPI pour la plateforme CDC-Gen",
    version="0.1.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # SvelteKit dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers utilisateur ──────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(bundles.router)
app.include_router(projects.router)
app.include_router(history.router)

# ─── Routers admin ────────────────────────────────────────────────────────────
app.include_router(admin_auth.router)
app.include_router(admin_users.router)
app.include_router(admin_stats.router)


@app.get("/")
async def root():
    return {"message": "CDC-Gen API is running 🚀"}
