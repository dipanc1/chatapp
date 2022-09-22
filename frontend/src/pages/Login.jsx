import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { backend_url } from '../production';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    HStack,
    useToast,
    InputRightElement,
    InputGroup,
    InputLeftElement,
    Image
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import PhoneNumber from '../components/Miscellaneous/PhoneNumber';
import Otp from '../components/Miscellaneous/Otp';
import Password from '../components/Miscellaneous/Password';


const Login = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [forgetPasswordValue, setForgetPasswordValue] = React.useState('')
    const [forgetConfirmPasswordValue, setForgetConfirmPasswordValue] = React.useState('')
    const [disable, setDisable] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false);
    const [forgetPassword, setForgetPassword] = React.useState(false);
    const [number, setNumber] = React.useState('');
    const [OTP, setOTP] = React.useState('');
    const [otpSent, setOtpSent] = React.useState(false);
    const user = JSON.parse(localStorage.getItem('user'))
    const toast = useToast();

    let navigate = useNavigate();

    const handleName = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleForgetPassword = () => {
        setForgetPassword(!forgetPassword)
    }

    const handleOtp = (e) => {
        setOTP(e)
    }

    const handleForgetPasswordValue = (e) => {
        setForgetPasswordValue(e.target.value)
    }

    const handleForgetConfirmPasswordValue = (e) => {
        setForgetConfirmPasswordValue(e.target.value)
    }

    const handleVerify = async () => {
        if (number.length >= 10) {
            await axios.post(`${backend_url}/users/forget-password-check-number`,
                { number: number })
                .then(res => {
                    setOtpSent(true)
                })
                .catch(err => {
                    toast({
                        title: "Error",
                        description: err.data.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                })
        }
        else {
            toast({
                title: "Invalid Number",
                description: "Please enter a valid number",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const handleResetPassword = async () => {
        if (forgetPasswordValue.length >= 8) {
            await axios.post(`${backend_url}/users/forget-password-check-otp-change-password`,
                { number: number, otp: OTP, password: forgetPasswordValue })
                .then(res => {
                    toast({
                        title: "Success",
                        description: "Password reset successfully",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                    setOtpSent(false)
                    setForgetPassword(false)
                })
                .catch(err => {
                    toast({
                        title: "Error",
                        description: err.data.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                })
        }
        else {
            toast({
                title: "Error",
                description: "Password must be atleast 8 characters long",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            username: username,
            password: password
        }
        setDisable(true)
        try {
            const res = await axios.post(`${backend_url}/users/login`, user);
            localStorage.setItem("user", JSON.stringify(res.data));
            // console.log("working!!", res)
            navigate('/chat')
        } catch (err) {
            toast({
                title: "Invalid username or password",
                description: "Please try again",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            // console.log("ERORO<<><<<<<<<<<<<", err)
        }
        setDisable(false)
    }

    React.useEffect(() => {
        if (user) {
            navigate('/chat')
        }
    }, [navigate, user])


    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            position={'relative'}
            bg={'backgroundColor'}
        >
            <Image
                src={'./images/login1.png'}
                w={'28'}
                position={'absolute'}
                left={'28'}
                bottom={'60'}
                opacity={['0', '0', '0', '0.5']}
            />
            <Image
                src={'./images/login2.png'}
                w={'48'}
                position={'absolute'}
                right={'28'}
                opacity={['0', '0', '0', '0.5']}
                bottom={'56'}
            />
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>{forgetPassword ? (otpSent ? 'Enter OTP' : 'Forgot Password') : 'Sign in to your account'}</Heading>
                    <Text color={'greyTextColor'}>
                        {forgetPassword ? (otpSent ? 'Enter Otp and New Password to reset the password' : 'Enter your registered mobile number to reset password') : 'Login to you account and get all access to chats'}
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    minH={'70vh'}
                    w={['86vw', '86vw', '25vw']}
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            {forgetPassword ? (
                                otpSent ?
                                    <>
                                        <Otp OTP={OTP} handleOtp={handleOtp} />
                                        <Password password={forgetPasswordValue} handlePassword={handleForgetPasswordValue}
                                            confirmPassword={forgetConfirmPasswordValue}
                                            handleConfirmPassword={handleForgetConfirmPasswordValue}
                                        />
                                    </>
                                    :
                                    <>
                                        <Image
                                            src={'./images/reset-password.png'}
                                        />
                                        <PhoneNumber number={number} setNumber={setNumber} />
                                    </>
                            ) : (
                                <>
                                    <FormControl id="email">
                                        <FormLabel>Username</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents='none'
                                                children={<AiOutlineUser color='greyTextColor' />}
                                            />
                                            <Input
                                                value={username}
                                                type={'text'}
                                                placeholder='Enter Your Username'
                                                focusBorderColor='#9F85F7'
                                                required
                                                onChange={handleName} />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="password">
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents='none'
                                                children={<AiOutlineLock color='greyTextColor' />}
                                            />
                                            <Input
                                                value={password} placeholder='Enter Password' required
                                                onChange={handlePassword}
                                                focusBorderColor='#9F85F7'
                                                type={showPassword ? 'text' : 'password'} />
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
                                </>
                            )}
                            <Stack spacing={10}>
                                {!forgetPassword &&
                                    <Stack
                                        direction={{ base: 'column', sm: 'row' }}
                                        align={'start'}
                                        justify={'space-between'}>
                                        <Text onClick={handleForgetPassword} color={'buttonPrimaryColor'}>
                                            <Link to={"# "}>
                                                Forgot Password?
                                            </Link>
                                        </Text>
                                    </Stack>}
                                <Button
                                    onClick={forgetPassword ? (otpSent ? handleResetPassword : handleVerify) : null}
                                    type={forgetPassword ? 'button' : 'submit'}
                                    disabled={forgetPassword ? (forgetPasswordValue !== forgetConfirmPasswordValue) : (username.length === 0 || password.length === 0 || disable)}
                                    bg={'buttonPrimaryColor'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'backgroundColor',
                                        color: 'text'
                                    }}
                                >
                                    {forgetPassword ? (
                                        otpSent ? 'Reset Password' : 'Send OTP'
                                    ) : 'Sign in'}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                    <HStack pt={10}>
                        <Text>
                            New User?{' '}
                        </Text>
                        <Text color={'buttonPrimaryColor'}>
                            <Link to={'/register'}>
                                Register
                            </Link>
                        </Text>
                    </HStack>
                </Box>
            </Stack>
        </Flex>
    )
}

export default Login