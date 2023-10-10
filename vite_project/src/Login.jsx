import { useState } from 'react';
import { useNavigate, Link, useSearchParams, redirect, json } from 'react-router-dom';
import './Login.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const backend = 'http://localhost:8000';
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get('mode') === 'login';



    function handleSubmit(event) {

        event.preventDefault();
        fetch(`${backend}/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'username': username, 'password': password }),
            },
            ).then(
                (response) => {
                    if (response.ok) {
                        redirect('/');
                    }
                });
    }

    return (
        <form className='Login-form' onSubmit={(event) => handleSubmit(event)}>
            <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
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
            <button className='Login-button' type='submit'>SAVE</button>
            <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>
                {isLogin ? 'Create new user' : 'Log in'}
            </Link>
        </form>
    );
}

// const Login = () => {
//     console.log("we here");
//     return <h1>LOGIN</h1>;
// };

export default Login;