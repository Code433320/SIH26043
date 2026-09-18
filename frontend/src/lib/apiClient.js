import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiFetch(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText || `Request failed with status ${response.status}`;

    try {
      const errorBody = JSON.parse(responseText);
      message = errorBody.message || message;
    } catch {
      // Keep the raw response when the server does not return JSON.
    }

    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}
