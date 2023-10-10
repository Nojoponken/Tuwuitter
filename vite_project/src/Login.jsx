import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const backend = 'http://localhost:8000';


    function handleSubmit(event) {
        event.preventDefault();
        fetch(`${backend}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': username, 'password': password }),
        }).then((response) => {
            if (response.ok) {
                navigate('/');
            }
        });
    }

    return (
        <form className='Login-form' onSubmit={(event) => handleSubmit(event)}>
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
            <button className='Login-button' type='submit'>Log in</button>
        </form>
    );
}

// const Login = () => {
//     console.log("we here");
//     return <h1>LOGIN</h1>;
// };

export default Login;