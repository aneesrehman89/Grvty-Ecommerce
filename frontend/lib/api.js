export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// Registered by the auth store so this module stays free of store imports
let getToken = () => null;
let onUnauthorized = () => {};

export const configureApi = ({ tokenGetter, unauthorizedHandler }) => {
  if (tokenGetter) getToken = tokenGetter;
  if (unauthorizedHandler) onUnauthorized = unauthorizedHandler;
};

/**
 * Thin fetch wrapper: JSON in/out, attaches the bearer token,
 * unwraps `{ data }` and throws ApiError with the server's message.
 */
export async function api(path, { method = 'GET', body, params, auth = true, ...init } = {}) {
  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });
  }

  const token = auth ? getToken() : null;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
      ...init,
    });
  } catch {
    throw new ApiError('Unable to reach the server. Please check your connection.', 0);
  }

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token) onUnauthorized();
    throw new ApiError(payload.message || 'Something went wrong', res.status, payload.errors);
  }

  return payload.data;
}
