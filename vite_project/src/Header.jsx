import {Outlet} from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className='Header'>
            <h1 className='Title'>tUwUitter</h1>
            <Outlet />
        </header>
    );
}
export default Header;