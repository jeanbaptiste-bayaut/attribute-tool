import './Leftnav.scss';
import { useAuth } from '../../context/AuthContext';

function Leftnav() {
  const { userName, logout } = useAuth();
  const isAuthenticated = userName;

  const handleLogout = () => {
    logout();
  };

  const hideNav = () => {
    const nav = document.querySelector('nav');
    nav?.classList.remove('open');
  };
  return (
    <nav>
      <div className="close" onClick={hideNav}>
        <span>x</span>
      </div>
      <a href="/">
        <h1>ATTRIBUTE CONTROL TOOL</h1>
      </a>

      <ul>
        <li>
          <a href="/control" onClick={hideNav}>
            Control Values
          </a>
        </li>
        <li>
          <a href="/export" onClick={hideNav}>
            Export
          </a>
        </li>
        <li>
          <a href="/upload" onClick={hideNav}>
            Upload data
          </a>
        </li>
        <li>
          <a
            href={import.meta.env.VITE_API_URL + '/api/tmp/upload'}
            onClick={hideNav}
            target="_blank"
          >
            TMP
          </a>
        </li>
      </ul>
      {isAuthenticated && (
        <div className="logout">
          <a href="/" onClick={handleLogout}>
            Logout
          </a>
        </div>
      )}
    </nav>
  );
}

export default Leftnav;
