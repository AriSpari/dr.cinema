import { API_KEY } from "@/secret";

const baseUrl = "https://api.kvikmyndir.is";

export async function fetchMovies() {
  const res = await fetch(`${baseUrl}/movies`, {
    method: "GET",
    headers: {
      "x-access-token": API_KEY,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return res.json();
}