import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/control', label: 'Control' },
  { path: '/upload', label: 'Upload' },
  { path: '/export', label: 'Export' },
];

const TopNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      style={{
        display: 'flex',
        gap: '2rem',
        padding: '1rem',
        background: '#f5f5f5',
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            textDecoration: 'none',
            color: location.pathname === item.path ? '#1976d2' : '#333',
            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default TopNav;
