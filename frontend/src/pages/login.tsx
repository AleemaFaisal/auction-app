import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { login } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e : any) => {
        console.log("submitting");
        e.preventDefault();
        if (username.trim() !== "" && password.trim() !== ""){
            const url = "http://localhost:8000/users/login";
            try{
                await axios.get(url, {
                    params : {
                        username,
                        password,
                    }
                })
                .then( res => {
                    console.log(res.data);
                    dispatch(login(res.data));
                })
                .catch(err => {
                    setErrorMsg(err.response.data);
                });
            }
            catch (err) {
                setErrorMsg("Oops! An error occured. Please try again.")
            }
        }
    }

  return (
    <div className="login pg">
    <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit} >
            <h2>Login</h2>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" required name="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" required name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
                <button type="submit" disabled={username.trim()==="" || password.trim()===""} >Login</button>
            </div>
        </form>
        {errorMsg!=="" && <p style={{color: 'red'}}>{errorMsg}</p>}
            <div className="form-group signup-link" onClick={() => navigate('/signup')}>
                Don't have an account? <a href="#">Sign up</a>
            </div>
    </div>
  </div>
  );
}