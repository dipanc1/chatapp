import React from 'react'
import './register.scss'
import OTPInput, { ResendOTP } from "otp-input-react";
import validator from 'validator'
import axios from 'axios';
import { PhoneNumberContext } from '../../context/phoneNumberContext';

const Register = () => {
    const {dispatch} = React.useContext(PhoneNumberContext);
    const [verify, setVerify] = React.useState(true);
    const [otp, setOtp] = React.useState(true);
    const [OTP, setOTP] = React.useState("");
    const [number, setNumber] = React.useState("");
    
    const number1 = React.useContext(PhoneNumberContext)
    
    const apiUrl = "http://localhost:8000/mobile";

    const handleNumber = (e) => {
        setNumber(e.target.value);
    }

    const handleVerify = () => {
        dispatch({type: "SET_NUMBER", payload: number});
        const isValidPhoneNumber = validator.isMobilePhone(number)
        if (isValidPhoneNumber) {
            setVerify(false);
            axios.post(apiUrl, { number }).then((res) => {
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

    // 

    const handleOtp = (OTP) => {
        setOTP(OTP);
        console.log(OTP);
        if (OTP.length === 5) {
            axios.post(`http://localhost:8000/otp`, { OTP, number1 }).then((res) => {
                console.log(res)
                if (res.data.resp.valid) {
                    setOtp(false)
                } else {
                    setOtp(true);
                }
            });
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
                                    <input type="text" id="username" name='username' placeholder='Enter User Name' required />
                                </div>
                                <div className="registerBoxFormInput">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id="password" name='password' placeholder='Enter Password' required />
                                </div>
                                <div className="registerBoxFormInput">
                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                    <input type="password" id="confirmpassword" name='confirmpassword' placeholder='Confirm Password' required />
                                </div>
                            </>
                        }
                        {(!verify && otp) &&
                            <div className="registerBoxFormInput">
                                <OTPInput value={OTP} onChange={handleOtp} autoFocus OTPLength={5} otpType="number" disabled={false} />
                                <ResendOTP renderButton={renderButton} renderTime={renderTime} maxTime={10} />
                            </div>
                        }
                        <div className="registerBoxFormButton">
                            {verify ? <button type="submit" onClick={handleVerify}>Verify Phone Number</button> : null}
                            {!otp ? <button type="submit">Register</button> : null}
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