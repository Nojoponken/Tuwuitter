import { getLogin, logOut, getUser } from './api.mjs'
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from './assets/logo.png'
import './style/Global.css'
import './style/Header.css';

function Header() {
    const [login, setLogin] = useState('to tUwUitter');
    const [search] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    async function checkSession() {
        let username = await getLogin();

        // Not logged in, go to login page
        if (!username && location.pathname != '/login') {
            navigate('/login');
            return;
        }

        // Update login display
        if (location.pathname == '/login') {
            // welcom message for login page
            setLogin(`to tUwUitter`);
        }
        else {
            // Set variable to display username and such
            setLogin(`${username}`);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        var x = document.getElementById('searchUsers').value; 
        console.log("YOU ARE WRITING " + x);
        // let searchUser = getUsers()

        // getUser(users);
    }

    useEffect(() => {
        checkSession();
    });


    return (
        <header className='Header'>
            <img className='Title' src={logo}/>
            <p className='Name-display'>Welcome {login}!</p>
            {/* search for other users bar */}
            <form onSubmit={(event) => handleSubmit(event)}>
                <button type='button' onClick={handleSubmit}>Search</button>
                <input 
                    type='text' 
                    placeholder='Search for users'
                    id='searchUsers'
                    // defaultValue=''
                />
            </form>
            {/* logout button */}
            <button className='Logout-button Button' type='submit' onClick={() => { logOut().then(checkSession()) }}>Logout</button>
        </header>
    );
}


export default Header;