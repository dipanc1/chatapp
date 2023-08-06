import React from 'react';
import { Alert, Box, Button, Flex, FormControl, Heading, HStack, Icon, Input, InputGroup, InputLeftAddon, InputRightAddon, Link, Stack, Text, useColorModeValue, useTheme, useToast, VStack } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { backend_url } from '../production';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhoneAppContext } from '../context/PhoneAppContext';

const Login = ({ navigation, setUser }) => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleName = e => {
        setUsername(e)
    }

    const handlePassword = (e) => {
        setPassword(e)
    }


    const handleSubmit = async () => {
        setLoading(true)
        const user = {
            username: username,
            password: password
        }
        try {
            const res = await axios.post(`${backend_url}/users/login`, user);
            await setUser(res.data)
            const jsonValue = JSON.stringify(res.data)
            await AsyncStorage.setItem('user', jsonValue)
            setLoading(false)
        } catch (err) {
            alert("Invalid username or password")
            console.log("ERROR:", err)
            setLoading(false)
        }
    }

    return (
        <Flex flex={1} align={'center'} justify={'center'} position={'relative'} bg={"primary.100"}>
            <Box py={'12'} rounded={'lg'} w={'80'} height={'xl'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'} bg={'#fff'}>
                <Heading color={'primary.600'} fontSize={'4xl'}>Login</Heading>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} w={'48'}>
                    <Text color={'primary.900'}>Login to you account and get</Text>
                    <Text color={'primary.900'}>all access to chats</Text>
                </Box>
                <VStack space={3} mt="5">
                    <FormControl>
                        <InputGroup w={{
                            base: '70%',
                            md: '285px'
                        }}>
                            <InputLeftAddon
                                children={<Icon as={AntDesign} name="user" />}
                            />
                            <Input
                                placeholder='Username'
                                w={{
                                    base: '84%',
                                    md: '285px'
                                }}
                                value={username}
                                onChangeText={handleName}
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <InputGroup w={{
                            base: '70%',
                            md: '285px'
                        }}
                        >
                            <InputLeftAddon
                                children={<Icon as={AntDesign} name="lock1" key={"lock1"} />}
                            />
                            <Input type="password"
                                placeholder='Password'
                                w={{
                                    base: '70%',
                                    md: '285px'
                                }}
                                color={'primary.900'}
                                value={password}
                                onChangeText={handlePassword}
                            />
                            <InputRightAddon
                                children={<Icon as={Feather} name="eye-off" key={"eye-off"} />}
                            />
                        </InputGroup>
                    </FormControl>
                    <Link _text={{
                        fontSize: "xs",
                        fontWeight: "500",
                        color: "primary.900"
                    }} alignSelf="flex-start" mt="1">
                        Forget Password?
                    </Link>
                    <Button
                        onPressIn={handleSubmit}
                        isLoading={loading}
                        isLoadingText="Signing in..."
                        _disabled={{
                            opacity: 0.5
                        }}
                        isDisabled={(username.length && password.length) === 0 && true}
                        rounded={'lg'} mt="2" bgColor="primary.300">
                        Sign in
                    </Button>
                    <HStack mt="6" justifyContent="center">
                        <Text fontSize="sm" color="primary.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            Are you a new user?{" "}
                        </Text>
                        <Link _text={{
                            color: "primary.600",
                            fontWeight: "medium",
                            fontSize: "sm"
                        }} onPress={
                            () => navigation.navigate('Register')
                        }>
                            Register here
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </Flex>
    );
};

export default Login;
