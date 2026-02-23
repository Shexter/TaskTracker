// Centralized API client for TaskTracker
// All backend communication goes through here

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Temporary: simulated user email for auth. Will be replaced with Supabase JWT.
const USER_EMAIL = 'user@tasktracker.dev';

function buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${API_BASE}/api${path}`);
    url.searchParams.set('email', USER_EMAIL);
    if (params) {
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    return url.toString();
}

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
    const res = await fetch(buildUrl(path, params));
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `API error ${res.status}`);
    }
    return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(buildUrl(path), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `API error ${res.status}`);
    }
    return res.json();
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(buildUrl(path), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `API error ${res.status}`);
    }
    return res.json();
}

export async function apiDelete(path: string): Promise<void> {
    const res = await fetch(buildUrl(path), { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `API error ${res.status}`);
    }
}
