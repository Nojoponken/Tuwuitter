import { useState } from 'react';
import { useNavigate, Link, useSearchParams, redirect, json } from 'react-router-dom';
import './Login.css'
// import { useCookies } from 'react-cookie';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [cookies, setCookies] = useCookies(['user']); 
    const navigate = useNavigate();
    const backend = 'http://localhost:8000';
    const [searchParams] = useSearchParams();
    const isRegister = searchParams.get('mode') === 'signup';

    function handleSubmit(event) {
        event.preventDefault();
        fetch(`${backend}/login`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'username': username, 'password': password }),
            },
        ).then(
            (response) => {
                if (response.ok) {
                    navigate('/');
                }
                else {
                    console.log(response);
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
            <button className='Login-button' type='submit'>{isRegister ? 'Register' : 'Log in'}</button>
            <Link to={`?mode=${isRegister ? 'login' : 'signup'}`}>
                {isRegister ? 'Already have an account' : 'Create new user'}
            </Link>
        </form>
    );
}

// const Login = () => {
//     console.log("we here");
//     return <h1>LOGIN</h1>;
// };

export default Login;