from fastapi import APIRouter, Cookie, HTTPException, Response
from pydantic import BaseModel

from app.services.user_services import (
	get_current_admin,
	sign_in as sign_in_service,
)


router = APIRouter()


class SignInRequest(BaseModel):
	email: str
	password: str


@router.get("/session")
def get_session(access_token: str | None = Cookie(default=None)):
	if not access_token:
		raise HTTPException(
			status_code=401,
			detail="Not authenticated.",
		)

	return {"user": get_current_admin(access_token)}


@router.post("/sign-in")
def sign_in_user(credentials: SignInRequest, response: Response):
	auth_result = sign_in_service(
		email=credentials.email,
		password=credentials.password,
	)

	response.set_cookie(
		key="access_token",
		value=auth_result["access_token"],
		max_age=auth_result["expires_in"],
		httponly=True,
		samesite="lax",
		secure=False,
		path="/",
	)
	response.set_cookie(
		key="refresh_token",
		value=auth_result["refresh_token"],
		max_age=60 * 60 * 24 * 30,
		httponly=True,
		samesite="lax",
		secure=False,
		path="/",
	)

	return {
		"message": auth_result["message"],
		"user": auth_result["user"],
	}
