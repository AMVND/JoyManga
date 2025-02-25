import React, { useState } from 'react';
import { login } from '../../auth/login'; // adjust the path as necessary

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientId, setClientId] = useState('personal-client-024ca21a-8b8d-4332-b56d-2d9470ca12f5-33c5c6e4');
  const [clientSecret, setClientSecret] = useState('c7oJME1Tn0XGlcfjsRyqUAoNGYQp394d');
  const [error, setError] = useState('');
  const [tokenData, setTokenData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ username, password, clientId, clientSecret });
      setTokenData(data);
      setError('');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  if (tokenData) {
    return (
      <div className="container my-4">
        <h2>Logged in successfully!</h2>
        <p>
          <strong>Access Token:</strong> {tokenData.access_token}
        </p>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: '400px' }}>
      <h1>Login with MangaDex</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="clientId" className="form-label">
            Client ID:
          </label>
          <input
            id="clientId"
            type="text"
            className="form-control"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="clientSecret" className="form-label">
            Client Secret:
          </label>
          <input
            id="clientSecret"
            type="text"
            className="form-control"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;