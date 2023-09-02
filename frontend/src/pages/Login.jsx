import axios from 'axios'
import React from 'react'
import { Link, useMatch } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { backend_url } from '../baseApi';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
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
import { AppContext } from '../context/AppContext';
import ReactGA from 'react-ga4';

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
    const [matchPath, setMatchPath] = React.useState(false);

    const { dispatch } = React.useContext(AppContext)
    const [groupDetails, setGroupDetails] = React.useState({})

    const user = JSON.parse(localStorage.getItem('user'))

    const toast = useToast();

    let navigate = useNavigate();
    let match = useMatch("/join-group/:groupId/login");

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
        if (match && match.pattern.path === "/join-group/:groupId/login") {
            try {
                const res = await axios.post(`${backend_url}/users/login`, user);

                const groupDetails = await axios.get(`${backend_url}/conversation/encrypted/chat/${match.params.groupId}`);

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${res.data.token}`,
                    },
                };
                const userDetails = await axios.get(`${backend_url}/users/user-info`, config);

                const { data } = await axios.put(
                    `${backend_url}/conversation/groupadd`,
                    { userId: userDetails.data._id, chatId: groupDetails.data._id },
                    config
                );

                localStorage.setItem("user", JSON.stringify(res.data));
                dispatch({
                    type: "SET_USER_INFO",
                    payload: userDetails.data,
                })

                ReactGA.event({
                    category: 'User',
                    action: 'User Logged In',
                    label: 'User Logged In',
                });

                navigate('/video-chat')

                dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
                setDisable(false)

            } catch (error) {
                // console.log(error);
                toast({
                    title: "Invalid username or password",
                    description: "Please try again",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                setDisable(false)

            }
        } else {
            try {
                const res = await axios.post(`${backend_url}/users/login`, user);

                localStorage.setItem("user", JSON.stringify(res.data));

                ReactGA.event({
                    category: 'User',
                    action: 'User Logged In',
                    label: 'User Logged In',
                });

                navigate('/video-chat')
                setDisable(false)

            } catch (err) {
                toast({
                    title: "Invalid username or password",
                    description: "Please try again",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                // console.log("ERORO<<><<<<<<<<<<<", err)
                setDisable(false)
            }
        }
    }

    React.useEffect(() => {
        if (user) {
            if (user.isSuperAdmin) {
                navigate('/dashboard')
            } else {
                navigate('/video-chat')
            }
        }
        if (match && match.pattern.path === "/join-group/:groupId/login") {
            setMatchPath(true);
            try {
                const getGroupDetails = async () => {
                    const { data } = await axios.get(`${backend_url}/conversation/encrypted/chat/${match.params.groupId}`)

                    setGroupDetails(data)

                };
                getGroupDetails();
            } catch (error) {
                console.log(error);
            }
        }
    }, [match, match?.pattern.path, navigate, user])


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
            <Box
                display={'flex'}
                maxW='800px'
                background='#fff'
                borderRadius='10px'
                boxShadow={'lg'}
                zIndex='0'
                overflow={'hidden'}
                p='2'
            >
                <Box
                    background={'#dcd2ff'}
                    flex={'1'}
                    display={'flex'}
                    alignItems={'center'}
                    borderRadius={'5px'}
                    flexShrink={'0'}
                >
                    {forgetPassword ? (
                        <Image
                            src={'https://ik.imagekit.io/sahildhingra/forgot-password-vector.png'}
                        />
                    ) : (
                        <Image
                            src={'https://ik.imagekit.io/sahildhingra/signup-vector.png'}
                        />
                    )
                    }
                </Box>
                <Box
                    p='5'
                    px='10'
                    flex={'1'}
                >
                    {matchPath ? <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>{groupDetails?.groupAdmin?.username} invited you</Heading>
                        <Text textAlign='center' pt='2' color={'greyTextColor'}>
                            to join {groupDetails?.chatName}
                        </Text>
                        <Text textAlign='center'>
                            with {groupDetails?.users?.length} other members
                        </Text>
                    </Stack> : <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>{forgetPassword ? (otpSent ? 'Enter OTP' : 'Forgot Password?') : 'Welcome Back!'}</Heading>
                        <Text textAlign='center' pt='2' color={'greyTextColor'}>
                            {forgetPassword ? (otpSent ? 'Enter Otp and New Password to reset the password' : 'No worries, Enter your registered mobile number to reset password') : 'Login to get access to chats and live streams'}
                        </Text>
                    </Stack>}
                    <Box
                        rounded={'lg'}
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        bg={useColorModeValue('white', 'gray.700')}
                        p={8}
                        px='0'
                    >
                        <form className='w-100' onSubmit={handleSubmit}>
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
                                        isDisabled={forgetPassword ? (forgetPasswordValue !== forgetConfirmPasswordValue) : (username.length === 0 || password.length === 0 || disable)}
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
                                <Link to={matchPath ? `/join-group/${match?.params.groupId}/register` : '/register'}>
                                    Register
                                </Link>
                            </Text>
                        </HStack>
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default Login