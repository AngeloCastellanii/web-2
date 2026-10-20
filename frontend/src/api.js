const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function parseJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { msg: text };
  }
}

export async function login(user, pw) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ user, pw })
  });
  return parseJson(res);
}

export async function logout() {
  const res = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return parseJson(res);
}

export async function me() {
  const res = await fetch(`${API_URL}/me`, {
    method: 'GET',
    credentials: 'include'
  });
  return parseJson(res);
}

export async function proccess(object_de, method_de, params = []) {
  const res = await fetch(`${API_URL}/proccess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ object_de, method_de, params })
  });
  return parseJson(res);
}
