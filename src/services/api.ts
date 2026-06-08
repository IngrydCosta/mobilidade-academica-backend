const API_URL = "http://localhost:3333"; 

export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`);

  if (!res.ok) {
    throw new Error("Erro na requisição");
  }

  return res.json();
}