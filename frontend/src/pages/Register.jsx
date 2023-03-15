import React from 'react'
import 'react-phone-number-input/style.css'
import validator from 'validator'
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { backend_url, pictureUpload } from '../baseApi';
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
    useToast,
    InputGroup,
    InputLeftElement,
    Avatar,
    IconButton,
    FormHelperText,
} from '@chakra-ui/react';
import { AiOutlineUser } from 'react-icons/ai';
import { FiUpload } from 'react-icons/fi';
import { ResendOTP } from "otp-input-react";
import PhoneNumber from '../components/Miscellaneous/PhoneNumber';
import Otp from '../components/Miscellaneous/Otp';
import Password from '../components/Miscellaneous/Password';

const Register = () => {
    const { dispatch } = React.useContext(AppContext);

    const [verify, setVerify] = React.useState(true);
    const [otp, setOtp] = React.useState(true);
    const [OTP, setOTP] = React.useState("");
    const [username, setUsername] = React.useState('');
    const [number, setNumber] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [formhelpUsername, setFormhelpUsername] = React.useState('')
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [loading, setLoading] = React.useState(false)

    const number1 = React.useContext(AppContext)
    let navigate = useNavigate();
    const toast = useToast();

    const fileInputRef = React.createRef();

    const apiUrlMobile = `${backend_url}/mobile`;
    const apiUrlOtp = `${backend_url}/otp`;
    const apiUrlRegister = `${backend_url}/users/register`;
    const apiUrlUsername = `${backend_url}/users/check-username`;
    

    const handleUsername = async (e) => {
        setUsername(e.target.value);
        e.target.value.length > 2 && await axios.get(`${apiUrlUsername}/${e.target.value}`)
            .then(res => {
                if (res.data) {
                    setFormhelpUsername(res.data.message)
                }
            }
            )
            .catch(err => console.log(err))

    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true)
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
            if (selectedImage === null) {
                await axios.post(apiUrlRegister, {
                    number1: number1,
                    username: username,
                    password: password,
                    pic: null
                })
                    .then(res => {
                        setLoading(false)
                        localStorage.setItem("user", JSON.stringify(res.data));
                        navigate('/');
                    })
                    .catch(err => {
                        setLoading(false)
                        toast({
                            title: "Error",
                            description: "Please enter valid details",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    })
            } else {
                const formData = new FormData();
                formData.append('api_key', '835688546376544')
                formData.append('file', selectedImage);
                formData.append('upload_preset', 'chat-app');
                await axios.post(pictureUpload, formData)
                    .then(async res => {
                        await axios.post(apiUrlRegister, {
                            number1: number1,
                            username: username,
                            password: password,
                            pic: res.data.url
                        })
                            .then(res => {
                                setLoading(false)
                                localStorage.setItem("user", JSON.stringify(res.data));
                                navigate('/');
                            })
                            .catch(err => {
                                setLoading(false)
                                toast({
                                    title: "Error",
                                    description: "Please enter valid details",
                                    status: "error",
                                    duration: 9000,
                                    isClosable: true,
                                });
                            })
                    })
                    .catch(err => {
                        toast({
                            title: "Error",
                            description: "Server error",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    })
            }
        }
    }

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png')) {
            setSelectedImage(e.target.files[0]);
        } else {
            toast({
                title: "Error",
                description: "Please upload a picture",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
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
                    if (res.data.message === "Welcome") {
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
                    w={['90vw', '80vw', '80vw', '25vw']}
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
                                <PhoneNumber number={number} setNumber={setNumber} />
                            }
                            {!otp &&
                                <Flex justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>

                                    <Flex justifyContent={''} alignItems={'flex-end'} flexDirection={'row'}>
                                        <Avatar
                                            size={'xl'}
                                            src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
                                            alt={'Avatar Alt'}
                                        />
                                        <IconButton
                                            aria-label="upload picture"
                                            icon={<FiUpload />}
                                            onClick={() => fileInputRef.current.click()}
                                            size="xs"
                                            colorScheme="teal"
                                            variant="outline"
                                            mt={'3'}
                                        />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={imageChange}
                                            style={{ display: 'none' }}
                                            required
                                        />
                                    </Flex>


                                    <FormControl id="username" isRequired>
                                        <FormLabel>User Name</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents='none'
                                                children={<AiOutlineUser color='greyTextColor' />}
                                            />
                                            <Input
                                                focusBorderColor={(username.length > 2 && formhelpUsername === "Username not available") ? '#FF4343' : '#9F85F7'}
                                                type="text" id="username"
                                                name='username'
                                                value={username}
                                                placeholder='Enter User Name'
                                                maxLength={20}
                                                minLength={2}
                                                onChange={handleUsername}
                                            />
                                        </InputGroup>
                                        {username.length > 2 && <FormHelperText>{formhelpUsername}</FormHelperText>}
                                    </FormControl>

                                    <Password password={password} confirmPassword={confirmPassword} handleConfirmPassword={handleConfirmPassword} handlePassword={handlePassword} />

                                </Flex>
                            }
                            {(!verify && otp) &&
                                <>
                                    <Otp OTP={OTP} handleOtp={handleOtp} />
                                    <ResendOTP renderButton={renderButton} renderTime={renderTime} maxTime={120} onClick={handleVerify} />
                                </>

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
                                        disabled={!(password === confirmPassword && username.length !== 0 && password.length >= 8) || loading}
                                        isLoading={loading}
                                        loadingText={"Registering"}
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