import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import './login.scss'
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
} from '@chakra-ui/react';

const Login = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [show, setShow] = React.useState(false)
    const user = JSON.parse(localStorage.getItem('user'))
    const toast = useToast();

    let navigate = useNavigate();

    const handleName = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleShow = () => {
        setShow(!show);
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
            setError(true)
            setErrorMessage("Invalid username or password")
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
            bg={useColorModeValue('blue.50', 'blue.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Username</FormLabel>
                                <Input value={username} type={'text'} placeholder='Enter Your Username' required onChange={handleName} />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input value={password} placeholder='Enter Password' required onChange={handlePassword} type={'password'} />
                            </FormControl>
                            {/* {error &&
                                <Text color={'red.400'}>
                                    {errorMessage}
                                </Text>
                            } */}
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    <Checkbox>Remember me</Checkbox>
                                    <HStack>
                                        <Text>
                                            New User?{' '}
                                        </Text>
                                        <Text color={'blue.500'}>
                                            <Link to={'/register'}>
                                                Register
                                            </Link>
                                        </Text>
                                    </HStack>
                                </Stack>
                                <Button
                                    type='submit'
                                    disabled={username.length === 0 || password.length === 0}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Sign in
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    )
}

export default Login