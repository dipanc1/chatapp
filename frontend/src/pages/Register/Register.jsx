import React from 'react'
import './register.scss'
import OTPInput, { ResendOTP } from "otp-input-react";
import validator from 'validator'
import axios from 'axios';
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const Register = () => {
    const { dispatch } = React.useContext(PhoneNumberContext);
    const [verify, setVerify] = React.useState(true);
    const [otp, setOtp] = React.useState(true);
    const [OTP, setOTP] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [number, setNumber] = React.useState("");
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState(false)

    let history = createBrowserHistory();
    const number1 = React.useContext(PhoneNumberContext)

    const apiUrlMobile = "http://localhost:8000/mobile";
    const apiUrlOtp = "http://localhost:8000/otp";
    const apiUrlRegister = "http://localhost:8000/users/register";

    const handleNumber = (e) => {
        setNumber(e.target.value);
    }

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(true);
        } else {
            axios.post(apiUrlRegister, {
                number1: number1,
                username: username,
                password: password
            })
                .then(res => {
                    console.log(res.data);
                    // dispatch({ type: "SET_PHONE_NUMBER", payload: number });
                    // setVerify(false);
                    // setOtp(false);
                    // setError(false);
                    history.push('/');
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const handleVerify = () => {
        dispatch({ type: "SET_NUMBER", payload: number });
        const isValidPhoneNumber = validator.isMobilePhone(number)
        if (isValidPhoneNumber) {
            setVerify(false);
            axios.post(apiUrlMobile, { number }).then((res) => {
                if (res.data) {
                    // console.log(res)
                    setNumber("");
                }
                else
                    alert('Invalid Phone Number')
            })
        } else {
            alert('Invalid Phone Number')
        }
    }

    const handleOtp = (OTP) => {
        setOTP(OTP);
        console.log(OTP);
        if (OTP.length === 5) {
            setTimeout(() => {
                axios.post(apiUrlOtp, { OTP, number1 }).then((res) => {
                    console.log(res)
                    if (res.data.resp.valid) {
                        setOtp(false)
                    } else {
                        setOtp(true);
                    }
                });
            }, 1000);
        }
    }

    const renderButton = (buttonProps) => {
        return <button style={{ cursor: buttonProps.remainingTime !== 0 && 'not-allowed' }} {...buttonProps} className='otp'>{buttonProps.remainingTime !== 0 ? `${buttonProps.remainingTime} seconds remaining` : "Resend"}</button>;
    };

    const renderTime = () => React.Fragment;


    return (
        <div className='register'>
            <div className="registerBox">
                <div className="registerBoxTitle">
                    <h1>Register</h1>
                </div>
                <div className="registerBoxForm">
                    <form>
                        {verify &&
                            <div className="registerBoxFormInput">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="text" id="phone" name='phone' placeholder='Enter Phone Number' required onChange={handleNumber} maxLength="10" minLength={10} />
                            </div>}
                        {!otp &&
                            <>
                                <div className="registerBoxFormInput">
                                    <label htmlFor="userName">User Name</label>
                                    <input type="text" id="username" name='username' value={username} placeholder='Enter User Name' required maxLength={20} minLength={2} onChange={handleUsername} />
                                </div>
                                <div className="registerBoxFormInput">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id="password" name='password' placeholder='Enter Password' value={password} required minLength={8} onChange={handlePassword} />
                                </div>
                                <div className="registerBoxFormInput">
                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                    <input type="password" id="confirmpassword" name='confirmpassword' placeholder='Confirm Password' required value={confirmPassword} onChange={handleConfirmPassword} />
                                </div>
                            </>
                        }
                        {(!verify && otp) &&
                            <div className="registerBoxFormInput">
                                <OTPInput value={OTP} onChange={handleOtp} autoFocus OTPLength={5} otpType="number" disabled={false} />
                                <ResendOTP renderButton={renderButton} renderTime={renderTime} maxTime={10} onClick={handleOtp} />
                            </div>
                        }
                        <div className="registerBoxFormButton">
                            {verify ? <button type="submit" onClick={handleVerify}>Verify Phone Number</button> : null}
                            {!otp && password === confirmPassword && (username.length !== 0 || password.length >= 8) ? <button type="submit" onClick={handleRegister}>Register</button> : null}
                        </div>
                     {error &&
                            <span className="failure">
                                Something Went Wrong!
                            </span>
                        }
                    </form>
                </div>
                <div className="registerBoxLink">
                    <p>
                        Already Have an Account? <Link to="/">Login</Link>
                        {/* <a href='/login'>Login</a> */}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register