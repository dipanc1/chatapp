import React from 'react'
import { Link } from 'react-router-dom'
import './login.scss'

const Login = () => {
    return (
        <div className='login'>
            <div className="loginBox">
                <div className="loginBoxTitle">
                    <h1>Login</h1>
                </div>
                <div className="loginBoxForm">
                    <form>
                        <div className="loginBoxFormInput">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name='phone' placeholder='Enter Phone Number' required />
                        </div>
                        <div className="loginBoxFormInput">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name='password' placeholder='Enter Password' required />
                        </div>
                        <div className="loginBoxFormButton">
                            <button type="submit">Login</button>
                        </div>
                    </form>
                </div>
                <div className="loginBoxLink">
                    <p>
                        New User? <Link to="/regsiter">Register</Link>
                        {/* <a href='/register'>Register</a> */}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login