import './App.scss';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from './context/AuthContext';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === 'storefront' && password === 'storefront') {
      Cookies.set('username', username, { expires: 1 });
      setIsAuthenticated(true);
    }
    login(username);
  };

  const checkAuth = () => {
    const storedUserName = Cookies.get('username');

    if (storedUserName) {
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <h1> Attribute Control Tool </h1>
      {isAuthenticated && (
        <div className="redirection-section">
          <a href="/control">Control Values</a>
          <a href="/export">Export</a>
          <a href="/upload">Upload data</a>
        </div>
      )}
      {!isAuthenticated && (
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button type="submit">Login</button>
        </form>
      )}
    </>
  );
}

export default App;
