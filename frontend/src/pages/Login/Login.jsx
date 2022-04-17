import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import './login.scss'
import { useHistory } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [show, setShow] = React.useState(false)
    const user = JSON.parse(localStorage.getItem('user'))

    let history = useHistory();

    const handleName = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleShow = () => {
        setShow(!show);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            username: username,
            password: password
        }
        try {
            const res = await axios.post("http://localhost:8000/users/login", user);
            localStorage.setItem("user", JSON.stringify(res.data));
            console.log("working!!", res)
            history.push("/chat")
        } catch (err) {
            setError(true)
            setErrorMessage("Invalid username or password")
            console.log(err)
        }

    }

    React.useEffect(() => {
        if (user) {  
            history.push("/chat")
        }
    }, [history, user])


    return (
        <div className='login'>
            <div className="loginBox">
                <div className="loginBoxTitle">
                    <h1>Login</h1>
                </div>
                <div className="loginBoxForm">
                    <form>
                        <div className="loginBoxFormInput">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name='username' placeholder='Enter Your Username' required onChange={handleName} />
                        </div>
                        <div className="loginBoxFormInput">
                            <label htmlFor="password">Password</label>
                            <input type={show ? "text" : "password"} id="password" name='password' placeholder='Enter Password' required onChange={handlePassword} />
                            {
                                !show ?
                                    <img src="/images/show-pass.png" alt="show" width={22} onClick={handleShow} style={{ cursor: "pointer" }} /> :
                                    <img src="/images/hide-pass.png" alt="show" width={22} onClick={handleShow} style={{ cursor: "pointer" }} />
                            }
                        </div>
                        <div className="loginBoxFormButton">
                            {username.length !== 0 && password.length !== 0 ? <button type="submit" onClick={handleSubmit}>Login</button>
                                : null}
                        </div>
                        {error &&
                            <span className="failure">
                                {errorMessage}
                            </span>
                        }
                    </form>
                </div>
                <div className="loginBoxLink">
                    <p>
                        New User? <Link to="/register">Register</Link>
                        {/* <a href='/register'>Register</a> */}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login