import React from 'react'
import './register.scss'
import OTPInput, { ResendOTP } from "otp-input-react";
import validator from 'validator'
import axios from 'axios';
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

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
    const [errorMessage, setErrorMessage] = React.useState('')
    const [show, setShow] = React.useState(false)
    const [pic, setPic] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const number1 = React.useContext(PhoneNumberContext)
    let history = useHistory();
    const cloudName = 'dipanc1';

    const apiUrlMobile = "http://localhost:8000/mobile";
    const apiUrlOtp = "http://localhost:8000/otp";
    const apiUrlRegister = "http://localhost:8000/users/register";
    const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

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

    const handleShow = () => {
        setShow(!show);
    }

    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            setPic('')
            setError(true)
            setErrorMessage('Please upload a profile picture')
        }
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const formData = new FormData();
            formData.append('api_key', '835688546376544')
            formData.append('file', pics);
            formData.append('upload_preset', 'chat-app');
            axios.post(pictureUpload, formData)
                .then(res => {
                    console.log(res);
                    setPic(res.data.url.toString());
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                    setError(true)
                    setErrorMessage('Server Error')
                })
        } else {
            setLoading(false)
            setError(true)
            setErrorMessage('Please upload a valid image')
        }
    }

    const handleRegister = (e) => {
        console.log(pic);
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(true);
            setErrorMessage('Passwords do not match');
        } else {
            axios.post(apiUrlRegister, {
                number1: number1,
                username: username,
                password: password,
                pic: pic
            })
                .then(res => {
                    console.log(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                    history.push('/');
                })
                .catch(err => {
                    console.log(err);
                    setError(true);
                    setErrorMessage('Please enter valid details');
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
                        setError(true);
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
                                    <input type={show ? "text" : "password"} id="password" name='password' placeholder='Enter Password' value={password} required minLength={8} onChange={handlePassword} />
                                    {
                                        !show ?
                                            <img src="/images/show-pass.png" alt="show" width={22} onClick={handleShow} style={{ cursor: "pointer" }} /> :
                                            <img src="/images/hide-pass.png" alt="show" width={22} onClick={handleShow} style={{ cursor: "pointer" }} />
                                    }
                                </div>
                                <div className="registerBoxFormInput">
                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                    <input type={show ? "text" : "password"} id="confirmpassword" name='confirmpassword' placeholder='Confirm Password' required value={confirmPassword} onChange={handleConfirmPassword} />
                                    {
                                        !show ?
                                            <img src="/images/show-pass.png" alt="show" width={22} onClick={handleShow} style={{ cursor: "pointer" }} /> :
                                            <img src="/images/hide-pass.png" alt="show" width={22} onClick={handleShow} style={{ cursor: "pointer" }} />
                                    }
                                </div>
                                <div className="registerBoxFormInput">
                                    <label htmlFor="uploadPicture">Upload Your Picture</label>
                                    <input type="file" accept='image/*'
                                        onChange={(e) =>
                                            postDetails(e.target.files[0])
                                        }
                                    />
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
                            {verify ? <button type="submit" onClick={handleVerify}>
                                <span>
                                    Verify Phone Number
                                </span></button> : null}
                            {!otp && password === confirmPassword && username.length !== 0 && password.length >= 8 ? <button type="submit" onClick={handleRegister} disabled={loading ? true : false}>{loading ? "Loading..." : "Register"}</button> : null}
                        </div>
                        {error &&
                            <span className="failure">
                                {errorMessage}
                            </span>
                        }
                    </form>
                </div>
                <div className="registerBoxLink">
                    <p>
                        Already Have an Account? <Link to="/">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register