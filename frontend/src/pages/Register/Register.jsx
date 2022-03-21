import React from 'react'
import './register.scss'

const Register = () => {

    const [verify, setVerify] = React.useState(false);
    const  [otp, setOtp] = React.useState(false);


    return (
        <div className='register'>
            <div className="registerBox">
                <div className="registerBoxTitle">
                    <h1>Register</h1>
                </div>
                <div className="registerBoxForm">
                    <form>
                        <div className="registerBoxFormInput">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name='phone' placeholder='Enter Phone Number' required />
                        </div>
                         <div className="registerBoxFormInput">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name='password' placeholder='Enter Password' required />
                        </div>
                        <div className="registerBoxFormInput">
                            <label htmlFor="confirmpassword">Confirm Password</label>
                            <input type="password" id="confirmpassword" name='confirmpassword' placeholder='Confirm Password' required />
                        </div>
                        <div className="registerBoxFormButton">
                            <button type="submit">Register</button>
                        </div>
                    </form>
                </div>
                <div className="registerBoxLink">
                    <p>
                        Already Have an Account? <a href='/login'>Login</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register