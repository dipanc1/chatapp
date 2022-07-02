import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { backend_url } from '../../production';
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
import { GrUserAdd } from 'react-icons/gr';
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai';

const Login = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false);
    const user = JSON.parse(localStorage.getItem('user'))
    const toast = useToast();

    let navigate = useNavigate();

    const handleName = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            username: username,
            password: password
        }
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
                opacity={'0.5'}
                bottom={'60'}
            />
            <Image
                src={'./images/login2.png'}
                w={'48'}
                position={'absolute'}
                right={'28'}
                opacity={'0.5'}
                bottom={'56'}
                            />
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    <Text color={'greyTextColor'}>
                        Login to you account and get all access
                        to chats
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
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    <Text color={'buttonPrimaryColor'}>
                                        <Link to={'/'}>
                                            Forgot Password?
                                        </Link>
                                    </Text>
                                </Stack>
                                <Button
                                    type='submit'
                                    disabled={username.length === 0 || password.length === 0}
                                    bg={'buttonPrimaryColor'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'backgroundColor',
                                        color: 'text'
                                    }}>
                                    Sign in
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