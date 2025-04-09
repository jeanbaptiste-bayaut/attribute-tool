import { Outlet } from 'react-router-dom';
import Leftnav from '../components/Leftnav/Leftnav';

function Root() {
  return (
    <>
      <div className="container">
        <Leftnav />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Root;
