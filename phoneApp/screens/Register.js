import React, { useRef } from 'react';
import { Avatar, Box, Button, Flex, FormControl, Heading, HStack, Icon, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, Link, Stack, Text, useColorModeValue, useTheme, VStack } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PhoneInput from 'react-native-phone-number-input';
import { StyleSheet } from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import { PhoneAppContext } from '../context/PhoneAppContext';
import { backend_url, pictureUpload } from '../production';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const Register = ({ navigation }) => {
    const { dispatch } = React.useContext(PhoneAppContext);
    const [verify, setVerify] = React.useState(true);
    const [otp, setOtp] = React.useState(true);
    const [username, setUsername] = React.useState('');
    const [number, setNumber] = React.useState('');
    const [formattedNumber, setFormattedNumber] = React.useState();
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [show, setShow] = React.useState(false)
    const [pic, setPic] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const phoneInput = useRef(null);
    const otpInput = useRef(null);
    const number1 = React.useContext(PhoneAppContext)

    const apiUrlMobile = `${backend_url}/mobile`;
    const apiUrlOtp = `${backend_url}/otp`;
    const apiUrlRegister = `${backend_url}/users/register`;


    const handleVerify = () => {
        dispatch({ type: 'SET_NUMBER', payload: formattedNumber });
        if (number !== NaN) {
            setError(false);
            setVerify(false);
            axios.post(apiUrlMobile, { number: formattedNumber })
                .then(res => {
                    console.log(res.data)
                })
                .catch(err => {
                    console.log("ERROR:", err)
                })
        }
        else {
            setError(true)
            setErrorMessage("Please enter a valid phone number")
        }
    }

    const handleOtp = (OTP) => {
        console.log("OTP", OTP);
        if (OTP.length === 5) {
            setTimeout(() => {
                console.log("NumberJHFBJKFDSJ", { number1 });
                axios.post(apiUrlOtp, { OTP, number1 })
                    .then((res) => {
                        console.log(res)
                        if (res.data.message === "Welcome") {
                            setOtp(false)
                        } else {
                            setOtp(true);
                            setError(true);
                        }
                    })
                    .catch((err) => {
                        console.log("ERROR:", err)
                    })
            }, 1000);
        }
    }

    const pickImage = async () => {
        const options = {
            // includeBase64: true,
            mediaType: 'photo',
            // saveToPhotos: true,
        };
        await launchImageLibrary(options, (response) => {

            console.log('Response = ', response.assets.map((item) => item));
            const res = response.assets.map((item) => item);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else {
                const uri = res.uri;
                const type = res.type;
                const name = res.fileName;
                const source = {
                    uri,
                    type,
                    name,
                }
                cloudinaryUpload(uri)
            }
        });

    }
    const cloudinaryUpload = (photo) => {
        let apiUrl = pictureUpload;
        const data = new FormData()
        data.append('file', photo)
        data.append('upload_preset', 'chat-app')
        data.append("cloud_name", "835688546376544")
        fetch(apiUrl, {
            method: "post",
            body: data
        }).then(res => res.json()).
            then(data => {
                setPic(data.secure_url)
            }).catch(err => {
                alert("An Error Occured While Uploading")
            })
    }

    const handleRegister = () => {
        setLoading(true)
        if (password !== confirmPassword) {
            setError(true);
            setErrorMessage('Passwords do not match');
            setLoading(false)
            return

        } else {
            const details = {
                username: username,
                number1: number1,
                password: password,
                pic: pic
            }
            axios.post(apiUrlRegister, details)
                .then(res => {
                    console.log(res.data);
                    setLoading(false);
                    navigation.navigate('Login');
                })
                .catch(err => {
                    console.log(err);
                    setError(true);
                    setLoading(false);
                    setErrorMessage('Please enter valid details');
                })
        }
    }

    return (
        <Flex flex={1} align={'center'} justify={'center'} position={'relative'} bg={"primary.100"}>
            <Box py={'8'} rounded={'lg'} w={'80'} height={'xl'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'} bg={'#fff'}>
                <Heading color={'primary.600'} fontSize={'4xl'}>
                    Register
                </Heading>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} w={'48'}>
                    {verify &&
                        <>
                            <Text color={'primary.900'}>Verify your phone number to</Text>
                            <Text color={'primary.900'}>start you registration process</Text>
                        </>
                    }
                    {(!verify && otp) &&
                        <>
                            <Text color={'primary.900'}>We sent an OTP to your </Text>
                            <Text color={'primary.900'}>register number. Enter that to</Text>
                            <Text color={'primary.900'}>verify your phone number</Text>
                        </>
                    }
                </Box>
                <VStack space={3} mt="5">
                    {verify &&
                        <PhoneInput
                            ref={phoneInput}
                            containerStyle={styles.registerInputPhone}
                            defaultValue={number}
                            defaultCode="IN"
                            layout="second"
                            onChangeText={(text) =>
                                dispatch({ type: 'SET_NUMBER', payload: text })}
                            onChangeFormattedText={(text) => setFormattedNumber(text)}
                            withDarkTheme
                            withShadow
                            autoFocus
                            textInputStyle={{
                                color: '#232323',
                            }}
                            placeholder=' '
                        />
                    }

                    {(!verify && otp) &&
                        <OTPTextView
                            handleTextChange={(OTP) => handleOtp(OTP)}
                            containerStyle={styles.textInputContainer}
                            textInputStyle={styles.lineTextInput}
                            inputCount={5}
                            inputCellLength={1}
                        />
                    }

                    {!otp &&
                        <>
                            <Box display={'flex'} alignItems={'flex-end'}>
                                <Avatar bg="pink.600" alignSelf="center" size="xl" source={{
                                    uri: (pic !== null ? pic : "https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2876&q=80")
                                }}>
                                    GG
                                </Avatar>
                                <IconButton onPress={() => pickImage()} variant={'ghost'} _icon={{
                                    as: MaterialIcons, name: "edit"
                                }} size={'md'} />
                            </Box>

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
                                    />
                                    <InputRightAddon
                                        children={<Icon as={Feather} name="eye-off" key={"eye-off"} />}
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
                                        placeholder='Confirm Password'
                                        w={{
                                            base: '70%',
                                            md: '285px'
                                        }}
                                        color={'primary.900'}
                                    />
                                    <InputRightAddon
                                        children={<Icon as={Feather} name="eye-off" key={"eye-off"} />}
                                    />
                                </InputGroup>
                            </FormControl>
                        </>}
                    {
                        verify &&
                        <Button onPress={handleVerify} rounded={'lg'} mt="2" bgColor="primary.300">
                            Verify Phone Number
                        </Button>
                    }
                    {(!verify && otp) &&
                        <Box display={'flex'} alignItems={'flex-end'}>
                            <Text color={'primary.300'}>Resend Code</Text>
                        </Box>
                    }
                    {!otp &&
                        <Button
                            disabled={password === confirmPassword && username.length !== 0 && password.length >= 8} 
                            isLoading={loading}
                            isLoadingText="Registering"
                            onPress={handleRegister}
                            rounded={'lg'}
                            mt="2"
                            bgColor="primary.300"
                        >
                            Register
                        </Button>
                    }

                    <HStack mt="6" justifyContent="center">
                        <Text fontSize="sm" color="primary.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            Already a user?{" "}
                        </Text>
                        <Link _text={{
                            color: "primary.600",
                            fontWeight: "medium",
                            fontSize: "sm"
                        }}
                            onPress={
                                () => {
                                    navigation.navigate('Login')
                                }
                            }>
                            Login here
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </Flex >
    );
};

const styles = StyleSheet.create({
    registerInputPhone: {
        width: 270,
        height: 80,
        borderRadius: 20,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    textInputContainer: {
        marginBottom: 20,
    },
    lineTextInput: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
})

export default Register;
