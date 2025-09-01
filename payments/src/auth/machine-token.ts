import axios from 'axios';

let cache: { token: string; exp: number } | null = null;

export async function getMachineToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cache && cache.exp - now > 30) return cache.token;

  const issuer = process.env.KEYCLOAK_ISSUER!;
  const url = `${issuer}/protocol/openid-connect/token`;
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.KEYCLOAK_CLIENT_ID!,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
  });

  const { data } = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 5000,
  });

  cache = { token: data.access_token, exp: now + data.expires_in };
  return cache.token;
}
