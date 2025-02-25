import axios from 'axios';

const AUTH_URL =
  'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token';

export async function login({ username, password, clientId, clientSecret }) {
  // Prepare the form data as URLSearchParams
  const data = new URLSearchParams();
  data.append('grant_type', 'password');
  data.append('username', username);
  data.append('password', password);
  data.append('client_id', clientId);
  data.append('client_secret', clientSecret);

  try {
    const response = await axios.post(AUTH_URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
