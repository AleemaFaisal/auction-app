import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { login } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function Signup(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()

    const handlePassword1Change = (e:any) => {
        if (errorMsg === "your passwords don't match, re-enter!")
            setErrorMsg("");
        setPassword(e.target.value);
    } 

    const handlePassword2Change = (e:any) => {
        if (errorMsg === "your passwords don't match, re-enter!")
            setErrorMsg("");
        setPassword2(e.target.value);
    } 

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        if (username.trim() !== "" && password.trim() !== "" && password2.trim()!==""){
            if (password !==password2){
                setErrorMsg("your passwords don't match, re-enter!")
            }
            else{
                console.log("sending signup request");
                const url = "http://localhost:8000/users/signup";
                try{
                    await axios.post(url, {
                        username,
                        password
                    })
                    .then( res => {
                        console.log(res);
                        dispatch(login(res.data));
                    })
                    .catch(err => {
                        setErrorMsg(err.response.data);
                    });
                }
                catch (err){
                    setErrorMsg("Oops! An error occured. Please try again.")
                }
            }
        }
    }

    return (
        <div className="login pg">
        <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" required name="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password1" required name="password" placeholder="Enter your password" value={password} onChange={handlePassword1Change} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Confirm Password</label>
                <input type="password" id="password2" required name="password" placeholder="Re-enter your password" value={password2} onChange={handlePassword2Change}   />
            </div>
            <div className="form-group">
                <button type="submit">Sign Up</button>
            </div>
        </form>
        <div className="form-group signup-link" onClick={() => navigate('/login')}>
            Already have an account? <a href="#">Login</a>
        </div>
        {errorMsg!=="" && <p style={{color: 'red'}} >{errorMsg}</p>}
    </div>
    </div>
    );
}