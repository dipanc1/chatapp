import React from 'react'
import './register.scss'
import OTPInput, { ResendOTP } from "otp-input-react";

const Register = () => {

    const [verify, setVerify] = React.useState(true);
    const [otp, setOtp] = React.useState(true);
    const [OTP, setOTP] = React.useState("");

    const handleVerify = () => {
        setVerify(false);
    }

    const handleOtp = (OTP) => {
        OTP.length === 5 ? setOtp(false) : setOtp(true);
        setOTP(OTP);
    }

    const renderButton = (buttonProps) => {
        return <button style={{cursor:buttonProps.remainingTime !== 0 && 'not-allowed'}} {...buttonProps} className='otp'>{buttonProps.remainingTime !== 0 ? `${buttonProps.remainingTime} seconds remaining` : "Resend"}</button>;
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
                                <input type="tel" id="phone" name='phone' placeholder='Enter Phone Number' required />
                            </div>}
                        {!otp &&
                            <>
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
                            <>
                                <div className="registerBoxFormInput">
                                    <OTPInput value={OTP} onChange={setOTP && handleOtp} autoFocus OTPLength={5} otpType="number" disabled={false} />
                                    <ResendOTP renderButton={renderButton} renderTime={renderTime} maxTime={10}/>
                                </div>
                            </>
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