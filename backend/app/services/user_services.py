from fastapi import HTTPException

from app.database.supabase_client import supabase, supabase_admin


def get_current_admin(access_token: str):
    try:
        auth_response = supabase.auth.get_user(access_token)
        user = auth_response.user
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Session expired. Please sign in again.",
        )

    try:
        profile_response = (
            supabase_admin
            .table("profiles")
            .select("id,email,role")
            .eq("email", user.email)
            .maybe_single()
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Internal error checking user profile",
        )

    profile = getattr(profile_response, "data", None)
    if not profile or str(profile.get("role", "")).upper() != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Only admin users can access this application.",
        )

    return {
        "id": user.id,
        "email": user.email,
        "role": profile["role"],
    }


def sign_in(email: str, password: str):
    normalized_email = email.strip().lower()

    try:
        profile_response = (
            supabase_admin
            .table("profiles")
            .select("id,email,role")
            .eq("email", normalized_email)
            .maybe_single()
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Internal error checking user profile",
        )

    profile = getattr(profile_response, "data", None)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="User not found. Please register first.",
        )

    if str(profile.get("role", "")).upper() != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Only admin users can sign in.",
        )

    try:
        auth_response = supabase.auth.sign_in_with_password(
            {
                "email": normalized_email,
                "password": password,
            }
        )
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    session = auth_response.session
    user = auth_response.user

    return {
        "message": "Sign in successful",
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "token_type": session.token_type,
        "expires_in": session.expires_in,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": profile["role"],
        },
    }