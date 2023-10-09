import { useState } from "react";
import { useNavigate } from "react";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        fetch(`${backend}/login`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ username: password }),
        }).then((r) => {
            if (r.ok) {
                r.json().then((user) => {
                    onLogin(user);
                    navigate('/');
                });
            }
        });
    }

    return (
        <form onSubmit={[handleSubmit]}>
            <label>Username</label>
            <input 
                type="text" 
                value={username} 
                //e.target är en referens till knappelementet som klickades på
                onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>
            <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default Login;