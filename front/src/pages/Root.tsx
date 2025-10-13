import { Outlet } from 'react-router-dom';
import TopNav from '../components/TopNav/TopNav';

function Root() {
  return (
    <>
      <div className="container">
        <TopNav />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Root;
