import { getLogin, logOut } from './api.mjs'
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from './assets/logo.png'
import './style/Global.css'
import './style/Header.css';

function Header() {
    const [login, setLogin] = useState('to tUwUitter');
    // const [search] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleSubmit(event) {
        let profile = await getLogin();
        navigate(`profile/${profile.username}`);
    }

    async function checkSession() {
        // Update login display
        if (location.pathname == '/login') {
            // welcom message for login page
            setLogin(`to tUwUitter`);
            return;
        }

        let user = await getLogin();

        // Not logged in, go to login page
        if (!user && location.pathname != '/login') {
            navigate('/login');
            return;
        }
        else {
            // Set variable to display username and such
            setLogin(`${user.username}`);
        }
    }

    useEffect(() => {
        checkSession();
    }, [location.pathname]);


    return (
        <header className='Header'>
            <img className='Title' src={logo} />
            <div className='Name-display'>
                <h1> Welcome {login}!</h1>
            </div>
            <nav className='Nav-bar'>
                <button className='Nav-button Button' onClick={() => {
                    handleSubmit()
                }}>Home</button>
                <button className='Nav-button Button' onClick={() => {
                    navigate('/search');
                }}>Search</button>
                <button className='Nav-button Button' onClick={() => {
                    logOut().then(checkSession())
                }}>Logout</button>
            </nav>
        </header>
    );
}


export default Header;