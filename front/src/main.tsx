import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import './index.scss';
import { AuthProvider } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Root from './pages/Root';
import App from './App';
// import ControlPage from './components/ControlPage/ControlPage';
import Loader from './components/Loader/Loader';
import Upload from './features/upload/components/Upload';
import Export from './features/export/components/export';
import PageNotfound from './pages/404/404';
import Control from './features/control/components/control';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const userLog = Cookies.get('username');

  if (!userLog) {
    return <Navigate to="/" />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<App />} />
      <Route
        path="/control"
        element={
          <PrivateRoute>
            <Control />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />
      <Route
        path="/export"
        element={
          <PrivateRoute>
            <Export />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<PageNotfound />} />
    </Route>
  )
);

// Rendu de l'application
root.render(
  <AuthProvider>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  </AuthProvider>
);
