import React from 'react';
import 'react-phone-number-input/style.css';
import validator from 'validator';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { Link, useMatch } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { api_key, pictureUpload, folder, emailRegex } from '../utils';
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
    Image,
} from '@chakra-ui/react';
import { AiOutlineUser } from 'react-icons/ai';
import { FiUpload } from 'react-icons/fi';
import { ResendOTP } from 'otp-input-react';
import PhoneNumber from '../components/Miscellaneous/PhoneNumber';
import Otp from '../components/Miscellaneous/Otp';
import Password from '../components/Miscellaneous/Password';
import BaseApi from '../services/apis/baseApi';
import authApi from '../services/apis/authApi';
import Cookies from 'universal-cookie';
import conversationApi from '../services/apis/conversationApi';

const Register = () => {
    const { dispatch, signature, timestamp, getCloudinarySignature, email } =
        React.useContext(AppContext);
    const baseApi = new BaseApi();
    const cookies = new Cookies();

    const [verify, setVerify] = React.useState(true);
    const [otp, setOtp] = React.useState(true);
    const [OTP, setOTP] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [number, setNumber] = React.useState('');
    const [emailState, setEmailState] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [formhelpUsername, setFormhelpUsername] = React.useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [matchPath, setMatchPath] = React.useState(false);
    const [groupDetails, setGroupDetails] = React.useState({});

    let match = useMatch('/join-group/:groupId/register');

    const number1 = React.useContext(AppContext);
    let navigate = useNavigate();
    const toast = useToast();

    const fileInputRef = React.createRef();

    const handleUsername = async (e) => {
        setUsername(e.target.value);
        if (e.target.value.length > 2 && e.target.value.length < 20) {
            let response = await authApi.checkIfUserNameExists(e.target.value);

            if (response.data) {
                setFormhelpUsername(response.data.message);
            } else {
                setFormhelpUsername('');
            }
        }
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        } else {
            if (selectedImage === null) {
                if (
                    match &&
                    match.pattern.path === '/join-group/:groupId/register'
                ) {
                    try {
                        const res = await authApi.register({
                            email,
                            username,
                            password,
                            pic: null,
                        });
                        const groupDetails =
                            await conversationApi.getConversationDetailWithEncryptedUrl(
                                match.params.groupId,
                            );

                        const config = {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${res.data.token}`,
                            },
                        };
                        const { data } = await conversationApi.addToGroup(
                            {
                                userId: res.data._id,
                                chatId: groupDetails.data._id,
                            },
                            config,
                        );

                        localStorage.setItem('user', JSON.stringify(res.data));
                        cookies.set('auth_token', data.token, {
                            domain: '.fundsdome.com' || 'localhost',
                            path: '/',
                        });

                        navigate('/video-chat');

                        setLoading(false);

                        dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
                    } catch (error) {
                        setLoading(false);
                        toast({
                            title: 'Error',
                            description: 'Please enter valid details',
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                } else {
                    const res = await authApi.register({
                        email,
                        username,
                        password,
                        pic: null,
                    });
                    if (res.status === 200) {
                        setLoading(false);
                        localStorage.setItem('user', JSON.stringify(res.data));
                        cookies.set('auth_token', res.token);
                        navigate('/');
                    } else {
                        setLoading(false);
                        toast({
                            title: 'Error',
                            description: 'Please enter valid details',
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                }
            } else {
                const formData = new FormData();
                formData.append('api_key', api_key);
                formData.append('file', selectedImage);
                formData.append('folder', folder);
                formData.append('timestamp', timestamp);
                formData.append('signature', signature);
                if (
                    match &&
                    match.pattern.path === '/join-group/:groupId/register'
                ) {
                    await axios
                        .post(pictureUpload, formData)
                        .then(async (res) => {
                            const response = await authApi.register({
                                email,
                                username,
                                password,
                                pic: res.data.secure_url,
                            });
                            if (response.data) {
                                setLoading(false);
                                const groupDetails =
                                    await conversationApi.getConversationDetailWithEncryptedUrl(
                                        match.params.groupId,
                                    );

                                const config = {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${response.data.token}`,
                                    },
                                };
                                const userDetails =
                                    await authApi.userInfo(config);

                                const { data } =
                                    await conversationApi.addToGroup(
                                        {
                                            userId: userDetails.data._id,
                                            chatId: groupDetails.data._id,
                                        },
                                        config,
                                    );

                                localStorage.setItem(
                                    'user',
                                    JSON.stringify(response.data),
                                );

                                navigate('/video-chat');

                                dispatch({
                                    type: 'SET_SELECTED_CHAT',
                                    payload: data,
                                });
                            } else {
                                setLoading(false);
                                toast({
                                    title: 'Error',
                                    description: 'Please enter valid details',
                                    status: 'error',
                                    duration: 9000,
                                    isClosable: true,
                                });
                            }
                        });
                } else {
                    await axios
                        .post(pictureUpload, formData)
                        .then(async (res) => {
                            const response = await authApi.register({
                                email,
                                username,
                                password,
                                pic: res.data.secure_url,
                            });
                            if (response.data) {
                                setLoading(false);
                                localStorage.setItem(
                                    'user',
                                    JSON.stringify(response.data),
                                );
                                navigate('/video-chat');
                            } else {
                                setLoading(false);
                                toast({
                                    title: 'Error',
                                    description: 'Please enter valid details',
                                    status: 'error',
                                    duration: 9000,
                                    isClosable: true,
                                });
                            }
                        })
                        .catch((err) => {
                            toast({
                                title: 'Error',
                                description: 'Server error',
                                status: 'error',
                                duration: 9000,
                                isClosable: true,
                            });
                        });
                }
            }
        }
    };

    const imageChange = async (e) => {
        await getCloudinarySignature();
        if (
            e.target.files &&
            e.target.files.length > 0 &&
            (e.target.files[0].type === 'image/jpeg' ||
                e.target.files[0].type === 'image/png')
        ) {
            setSelectedImage(e.target.files[0]);
        } else {
            toast({
                title: 'Error',
                description: 'Please select a valid image',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    const renderButton = (buttonProps) => {
        return (
            <Button
                mt={'3'}
                size='lg'
                bg={'buttonPrimaryColor'}
                color={'white'}
                _hover={{
                    bg: 'backgroundColor',
                    color: 'text',
                }}
                style={{
                    cursor: buttonProps.remainingTime !== 0 && 'not-allowed',
                }}
                {...buttonProps}
            >
                {buttonProps.remainingTime !== 0
                    ? `${buttonProps.remainingTime} seconds remaining`
                    : 'Resend'}
            </Button>
        );
    };

    const renderTime = () => React.Fragment;

    const handleVerify = async () => {
        if (number === '') {
            toast({
                title: 'Error',
                description: 'Please enter a valid phone number',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        dispatch({ type: 'SET_NUMBER', payload: number });
        const isValidPhoneNumber = validator.isMobilePhone(number);
        if (isValidPhoneNumber) {
            const response = baseApi.sendOtpOnPhoneNumber({ number });
            if (response !== undefined && response.data) {
                setVerify(false);
                setNumber('');
            } else {
                toast({
                    title: 'Error',
                    description: 'Please enter valid phone number',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: 'Error',
                description: 'Please enter valid phone number',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    const handleVerifyEmail = async () => {
        if (emailRegex.test(emailState) === false) {
            toast({
                title: 'Error',
                description: 'Please enter a Valid Email',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        dispatch({ type: 'SET_EMAIL', payload: emailState });
        const response = await baseApi.sendOtpOnEmail({ email: emailState });
        if (response.status === 200 && response.data.message === 'OTP sent successfully') {
            setVerify(false);
            setEmailState('');
        } else {
            toast({
                title: 'Error',
                description: 'Please enter a valid email',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    const handleOtp = (OTP) => {
        setOTP(OTP);
        // console.log(OTP);
        if (OTP.length === 5) {
            setTimeout(async () => {
                const response = await baseApi.verifyEmailOtp({ email, otp: OTP });
                if (response.data.message === 'OTP verified successfully' && response.status === 200) {
                    setOtp(false);
                } else {
                    setOtp(true);
                    toast({
                        title: 'Error',
                        description: 'Please enter valid OTP',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    });
                }
            }, 1000);
        }
    };

    React.useEffect(() => {
        if (match && match.pattern.path === '/join-group/:groupId/register') {
            setMatchPath(true);
            try {
                const getGroupDetails = async () => {
                    const { data } =
                        await conversationApi.getConversationDetailWithEncryptedUrl(
                            match.params.groupId,
                        );

                    setGroupDetails(data);
                };
                getGroupDetails();
            } catch (error) {
                console.log(error);
            }
        }
    }, [match, match?.pattern.path]);

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={'backgroundColor'}
        >
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
                    <Image
                        src={
                            'https://ik.imagekit.io/sahildhingra/new-user-vector.png'
                        }
                    />
                </Box>
                <Box p='5' px='10' flex={'1'}>
                    {matchPath ? (
                        <Stack align={'center'}>
                            <Heading fontSize={'4xl'}>
                                {groupDetails?.groupAdmin?.username} invited you
                            </Heading>
                            <Text
                                textAlign='center'
                                pt='2'
                                color={'greyTextColor'}
                            >
                                to join {groupDetails?.chatName}
                            </Text>
                            <Text pt='2' color={'greyTextColor'}>
                                Enter email to create an account
                            </Text>
                        </Stack>
                    ) : (
                        <Stack align={'center'}>
                            <Heading fontSize={'4xl'}>Get Started Now!</Heading>
                            <Text pt='2' color={'greyTextColor'}>
                                Enter email to create an account
                            </Text>
                        </Stack>
                    )}
                    <Box
                        rounded={'lg'}
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        bg={useColorModeValue('white', 'gray.700')}
                        px='0'
                    >
                        <Box
                            rounded={'lg'}
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            bg={useColorModeValue('white', 'gray.700')}
                            p={8}
                            px='0'
                            w='100%'
                        >
                            <Stack width='100%' spacing={10}>
                                <form className='w-100'>
                                    {verify && (
                                        // <PhoneNumber
                                        //     number={number}
                                        //     setNumber={setNumber}
                                        // />
                                        <Input type='email' focusBorderColor='#9F85F7' onChange={(e) => setEmailState(e.target.value)} placeholder='Enter Email' value={emailState} />
                                    )}
                                    {!otp && (
                                        <Flex
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            flexDirection={'column'}
                                        >
                                            <Flex
                                                justifyContent={''}
                                                alignItems={'flex-end'}
                                                flexDirection={'row'}
                                            >
                                                <Avatar
                                                    size={'xl'}
                                                    src={
                                                        selectedImage
                                                            ? URL.createObjectURL(
                                                                selectedImage,
                                                            )
                                                            : ''
                                                    }
                                                    alt={'Avatar Alt'}
                                                />
                                                <IconButton
                                                    aria-label='upload picture'
                                                    icon={<FiUpload />}
                                                    onClick={() =>
                                                        fileInputRef.current.click()
                                                    }
                                                    size='xs'
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    mt={'3'}
                                                />
                                                <input
                                                    type='file'
                                                    ref={fileInputRef}
                                                    onChange={imageChange}
                                                    style={{ display: 'none' }}
                                                    required
                                                />
                                            </Flex>

                                            <FormControl
                                                id='username'
                                                isRequired
                                            >
                                                <FormLabel>User Name</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents='none'
                                                        children={
                                                            <AiOutlineUser color='greyTextColor' />
                                                        }
                                                    />
                                                    <Input
                                                        focusBorderColor={
                                                            username.length >
                                                                2 &&
                                                                formhelpUsername ===
                                                                'Username not available'
                                                                ? '#FF4343'
                                                                : '#9F85F7'
                                                        }
                                                        type='text'
                                                        id='username'
                                                        name='username'
                                                        value={username}
                                                        placeholder='Enter User Name'
                                                        maxLength={20}
                                                        minLength={2}
                                                        onChange={
                                                            handleUsername
                                                        }
                                                    />
                                                </InputGroup>
                                                {username.length > 2 && (
                                                    <FormHelperText>
                                                        {formhelpUsername}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <Password
                                                password={password}
                                                confirmPassword={
                                                    confirmPassword
                                                }
                                                handleConfirmPassword={
                                                    handleConfirmPassword
                                                }
                                                handlePassword={handlePassword}
                                            />
                                        </Flex>
                                    )}
                                    {!verify && otp && (
                                        <>
                                            <Otp
                                                OTP={OTP}
                                                handleOtp={handleOtp}
                                            />
                                            <ResendOTP
                                                renderButton={renderButton}
                                                renderTime={renderTime}
                                                maxTime={120}
                                                onClick={handleVerify}
                                            />
                                        </>
                                    )}
                                    <Stack spacing={10} pt={8}>
                                        {verify && (
                                            <Button
                                                onClick={handleVerifyEmail}
                                                loadingText={
                                                    loading && 'Submitting'
                                                }
                                                size='lg'
                                                bg={'buttonPrimaryColor'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'backgroundColor',
                                                    color: 'text',
                                                }}
                                            >
                                                Verify Email
                                            </Button>
                                        )}

                                        {!otp ? (
                                            <Button
                                                type='submit'
                                                onClick={handleRegister}
                                                isDisabled={
                                                    !(
                                                        password ===
                                                        confirmPassword &&
                                                        username.length !== 0 &&
                                                        password.length >= 8
                                                    ) || loading
                                                }
                                                isLoading={loading}
                                                loadingText={'Registering'}
                                                size='lg'
                                                bg={'buttonPrimaryColor'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'backgroundColor',
                                                    color: 'text',
                                                }}
                                            >
                                                Register
                                            </Button>
                                        ) : null}
                                    </Stack>
                                </form>
                            </Stack>
                            <Stack direction={'row'} pt={10}>
                                <Text>Already a user?</Text>
                                <Link
                                    to={
                                        matchPath
                                            ? `/join-group/${match?.params.groupId}/login`
                                            : '/'
                                    }
                                >
                                    <Text color={'buttonPrimaryColor'}>
                                        Login
                                    </Text>
                                </Link>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};

export default Register;
