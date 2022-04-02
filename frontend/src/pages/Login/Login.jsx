import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import './login.scss'

const Login = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleName = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            username: username,
            password: password
        }
        try {
            const res = await axios.post("http://localhost:8000/users/login", user);
            localStorage.setItem("user", JSON.stringify(username));
            console.log("working!!", res)
        } catch (err) {
            // setError(true)
            console.log(err)
        }

    }


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
                            <input type="password" id="password" name='password' placeholder='Enter Password' required onChange={handlePassword} />
                        </div>
                        <div className="loginBoxFormButton">
                            <button type="submit" onClick={handleSubmit}>Login</button>
                        </div>
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