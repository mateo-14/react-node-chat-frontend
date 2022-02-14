export function auth(username: string): Promise<{ token: string; username: string } | null> {
  return fetch(`${import.meta.env.VITE_API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
    }),
  }).then((res: Response) => {
    if (res.ok) return res.json();
    throw new Error(res.statusText);
  });
}
