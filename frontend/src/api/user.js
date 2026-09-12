import API_BASE_URL from './config';


export async function signIn(email, password) {
	const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ email, password }),
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(
			result.detail || result.message || 'Unable to sign in'
		);
	}

	return result;
}


export async function getSession() {
	const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
		credentials: 'include',
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(
			result.detail || result.message || 'Not authenticated'
		);
	}

	return result;
}
