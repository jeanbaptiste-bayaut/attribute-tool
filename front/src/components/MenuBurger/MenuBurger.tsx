import './MenuBurger.scss';

function MenuBurger() {
  const handleMenu = () => {
    const nav = document.querySelector('nav');
    nav?.classList.toggle('open');
  };
  return (
    <div className="menu-burger" onClick={handleMenu}>
      <div className="menu-burger__line"></div>
      <div className="menu-burger__line"></div>
      <div className="menu-burger__line"></div>
    </div>
  );
}

export default MenuBurger;
