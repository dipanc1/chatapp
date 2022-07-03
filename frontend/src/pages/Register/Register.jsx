import React from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import './register.scss'
import { ResendOTP } from "otp-input-react";
import validator from 'validator'
import axios from 'axios';
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { backend_url } from '../../production';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    PinInput,
    PinInputField,
    useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Register = () => {
    const { dispatch } = React.useContext(PhoneNumberContext);
    const [verify, setVerify] = React.useState(true);
    const [otp, setOtp] = React.useState(true);
    const [OTP, setOTP] = React.useState("");
    const [username, setUsername] = React.useState('');
    const [number, setNumber] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [pic, setPic] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const number1 = React.useContext(PhoneNumberContext)
    let navigate = useNavigate();
    const toast = useToast();

    const cloudName = 'dipanc1';
    const apiUrlMobile = `${backend_url}/mobile`;
    const apiUrlOtp = `${backend_url}/otp`;
    const apiUrlRegister = `${backend_url}/users/register`;
    const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;



    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            setPic('')
            toast({
                title: "Error",
                description: "Please upload a picture",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const formData = new FormData();
            formData.append('api_key', '835688546376544')
            formData.append('file', pics);
            formData.append('upload_preset', 'chat-app');
            axios.post(pictureUpload, formData)
                .then(res => {
                    // console.log(res);
                    setPic(res.data.url.toString());
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                    toast({
                        title: "Error",
                        description: "Server error",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                })
        } else {
            setLoading(false)
            toast({
                title: "Error",
                description: "Please upload a picture",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const handleRegister = (e) => {
        // console.log(pic);
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return
        } else {
            axios.post(apiUrlRegister, {
                number1: number1,
                username: username,
                password: password,
                pic: pic
            })
                .then(res => {
                    // console.log(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                    navigate('/');
                })
                .catch(err => {
                    // console.log(err);
                    toast({
                        title: "Error",
                        description: "Please enter valid details",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                })
        }
    }

    const handleVerify = () => {
        if (number === '') {
            toast({
                title: "Error",
                description: "Please enter a valid phone number",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return
        }
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
                    toast({
                        title: "Error",
                        description: "Please enter valid phone number",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
            })
        } else {
            toast({
                title: "Error",
                description: "Please enter valid phone number",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const handleOtp = (OTP) => {
        setOTP(OTP);
        // console.log(OTP);
        if (OTP.length === 5) {
            setTimeout(() => {
                axios.post(apiUrlOtp, { OTP, number1 }).then((res) => {
                    // console.log(res)
                    if (res.data.resp.valid) {
                        setOtp(false)
                    } else {
                        setOtp(true);
                        toast({
                            title: "Error",
                            description: "Please enter valid OTP",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                });
            }, 1000);
        }
    }

    const renderButton = (buttonProps) => {
        return <Button mt={'3'} size="lg"
            bg={'buttonPrimaryColor'}
            color={'white'}
            _hover={{
                bg: 'backgroundColor',
                color: 'text'
            }} style={{ cursor: buttonProps.remainingTime !== 0 && 'not-allowed' }} {...buttonProps}>{buttonProps.remainingTime !== 0 ? `${buttonProps.remainingTime} seconds remaining` : "Resend"}</Button>;
    };

    const renderTime = () => React.Fragment;

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={'backgroundColor'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                    <Text color={'greyTextColor'}>
                        Verify your phone number to start your registration process
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    minH={'70vh'}
                    w={'25vw'}
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={10}>
                        <form>
                            {verify &&
                                <FormControl id="number" isRequired>
                                    <FormLabel>Phone Number</FormLabel>
                                    <PhoneInput
                                        international
                                        defaultCountry="IN"
                                        value={number}
                                        onChange={setNumber} />
                                </FormControl>}
                            {!otp &&
                                <>
                                    <FormControl id="username" isRequired>
                                        <FormLabel>User Name</FormLabel>
                                        <Input type="text" id="username" name='username' value={username} placeholder='Enter User Name' maxLength={20} minLength={2} onChange={handleUsername} />
                                    </FormControl>
                                    <FormControl id="password" isRequired>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input type={showPassword ? 'text' : 'password'} id="password" name='password' placeholder='Enter Password' value={password} minLength={8} onChange={handlePassword} />
                                            <InputRightElement h={'full'}>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() =>
                                                        setShowPassword((showPassword) => !showPassword)
                                                    }>
                                                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="confirmpassword" isRequired>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <InputGroup>
                                            <Input type={showPassword ? 'text' : 'password'} id="confirmpassword" name='confirmpassword' placeholder='Confirm Password' value={confirmPassword} onChange={handleConfirmPassword} />
                                            <InputRightElement h={'full'}>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() =>
                                                        setShowPassword((showPassword) => !showPassword)
                                                    }>
                                                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>

                                    <FormControl id="picture" isRequired>
                                        <FormLabel>Upload Your Picture</FormLabel>
                                        <Input type="file" accept='image/*' onChange={(e) =>
                                            postDetails(e.target.files[0])
                                        } />
                                    </FormControl>

                                </>
                            }
                            {(!verify && otp) &&
                                <FormControl>
                                    <PinInput onChange={handleOtp} value={OTP} otp>
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                        <PinInputField />
                                    </PinInput>
                                    <ResendOTP renderButton={renderButton} renderTime={renderTime} maxTime={120} onClick={handleVerify} />

                                </FormControl>
                            }
                            <Stack spacing={10} pt={8}>
                                {verify ?
                                    <Button
                                        type="submit"
                                        onClick={handleVerify}
                                        loadingText={loading && "Submitting"}
                                        size="lg"
                                        bg={'buttonPrimaryColor'}
                                        color={'white'}
                                        _hover={{
                                            bg: 'backgroundColor',
                                            color: 'text'
                                        }}>
                                        Verify Phone Number
                                    </Button> : null}

                                {!otp ?
                                    <Button
                                        type="submit"
                                        onClick={handleRegister}
                                        disabled={!(password === confirmPassword && username.length !== 0 && password.length >= 8 && pic.length !== 0)}
                                        loadingText={loading && "Submitting"}
                                        size="lg"
                                        bg={'buttonPrimaryColor'}
                                        color={'white'}
                                        _hover={{
                                            bg: 'backgroundColor',
                                            color: 'text'
                                        }}>
                                        Register
                                    </Button> : null}
                            </Stack>
                        </form>
                    </Stack>
                    <Stack direction={'row'} pt={10}>
                        <Text>Already a user?</Text>
                        <Link to="/">
                            <Text color={'buttonPrimaryColor'}>Login</Text>
                        </Link>
                    </Stack>
                </Box>
            </Stack >
        </Flex >
    )
}

export default Register