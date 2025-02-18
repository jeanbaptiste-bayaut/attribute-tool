import { Outlet } from 'react-router-dom';
import Leftnav from '../components/Leftnav/Leftnav';
import MenuBurger from '../components/MenuBurger/MenuBurger';

function Root() {
  return (
    <>
      <MenuBurger />
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
