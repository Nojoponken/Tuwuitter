import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { signUp, logIn, getLogin } from "./api.mjs";
import "./style/Global.css";
import "./style/Login.css";
// import { useCookies } from 'react-cookie';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get("mode") === "signup";
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    // Try to log in and navigate to home page
    if (isRegister) {
      let successful = await signUp(username, password);
      if (successful) {
        setUsername("");
        setPassword("");
        navigate("/login");
      } else {
        setError(true);
      }
    } else {
      let successful = await logIn(username, password);
      if (successful) {
        let login = await getLogin();
        navigate(`/profile/${login.username}`);
      } else {
        setError(true);
      }
    }
  }

  useEffect(() => {
    setError(false);
  }, [isRegister]);

  return (
    <form className="Login-form" onSubmit={(event) => handleSubmit(event)}>
      <h1>{isRegister ? "Create new user" : "Log in"}</h1>
      <label>Username</label>
      <input
        className="Login-textbox"
        type="text"
        value={username}
        //event.target är en referens till knappelementet som klickades på
        onChange={(event) => setUsername(event.target.value)}
      />

      <label>Password</label>
      <input
        className="Login-textbox"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <p className={error ? "error" : "error hide"}>
        {isRegister ? "Could not register user" : "Wrong username or password"}
      </p>
      <button className="Login-button Button" type="submit">
        {isRegister ? "Register" : "Log in"}
      </button>
      <Link to={`?mode=${isRegister ? "login" : "signup"}`}>
        {isRegister ? "Already have an account" : "Create new user"}
      </Link>
    </form>
  );
}

export default Login;
