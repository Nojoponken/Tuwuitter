import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { logIn } from './api.mjs';
import './style/Global.css'
import './style/Login.css'
// import { useCookies } from 'react-cookie';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [cookies, setCookies] = useCookies(['user']); 
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isRegister = searchParams.get('mode') === 'signup';

    function handleSubmit(event) {
        event.preventDefault();

        // Try to log in and navigate to home page
        logIn(username, password)
            .then((successful) => {
                if (successful) {
                    navigate('/');
                }
            });
    }

    return (
        <form className='Login-form' onSubmit={(event) => handleSubmit(event)}>
            <h1>{isRegister ? 'Create new user' : 'Log in'}</h1>
            <label>Username</label>
            <input
                className='Login-textbox'
                type='text'
                value={username}
                //e.target är en referens till knappelementet som klickades på
                onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>
            <input
                className='Login-textbox'
                type='text'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className='Login-button Button' type='submit'>{isRegister ? 'Register' : 'Log in'}</button>
            <Link to={`?mode=${isRegister ? 'login' : 'signup'}`}>
                {isRegister ? 'Already have an account' : 'Create new user'}
            </Link>
        </form>
    );
}

export default Login;