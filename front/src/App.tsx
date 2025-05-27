import './App.scss';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAuth } from './context/AuthContext';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const checkCredentials = await axios.post(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/user/login`,
      {
        email,
        password,
      }
    );

    const user = JSON.stringify(checkCredentials.data);

    console.log(user);

    if (checkCredentials.status !== 200) {
      alert('Invalid credentials');
      return;
    } else {
      Cookies.set('username', user, { expires: 1 });
      setIsAuthenticated(true);
    }
    login(user);
  };

  const checkAuth = () => {
    const storedUserName = Cookies.get('username');

    if (storedUserName) {
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    checkAuth();
    console.log(Cookies.get('username'));
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
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
