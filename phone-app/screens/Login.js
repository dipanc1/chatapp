import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { backend_url } from '../production'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [show, setShow] = React.useState(false)

    const handleName = (e) => {
        setUsername(e)
    }

    const handlePassword = (e) => {
        setPassword(e)
    }

    const handleSubmit = async () => {
        const user = {
            username: username,
            password: password
        }
        try {
            const res = await axios.post(`${backend_url}/users/login`, user);
            console.log("working!!", res.data)
            // localStorage.setItem("user", JSON.stringify(res.data));
            const jsonValue = JSON.stringify(res.data)
            AsyncStorage.setItem('user', jsonValue)
        } catch (err) {
            setError(true)
            setErrorMessage("Invalid username or password")
            console.log("ERROR:", err)
        }
    }


    return (
        <View style={styles.login}>
            <View style={styles.loginBox}>
                <Text style={styles.loginHeading}>Login</Text>
                <View>
                    <Text style={styles.loginLabel}>Username</Text>
                    <TextInput
                        placeholder='Enter Your Username'
                        placeholderTextColor={'#000'}
                        style={styles.loginInput}
                        value={username}
                        onChangeText={handleName}
                        blurOnSubmit={true}
                    />
                    <Text style={styles.loginLabel}>Password</Text>
                    <TextInput
                        placeholder='Enter Your Password'
                        blurOnSubmit={true}
                        placeholderTextColor={'#000'}
                        secureTextEntry={true}
                        style={styles.loginInput}
                        value={password}
                        onChangeText={handlePassword}
                    />
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} disabled={(username.length || password.length) === 0 && true}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                {error &&
                    <Text className={styles.failure}>
                        {errorMessage}
                    </Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    login: {
        flex: 1,
        backgroundColor: '#B4CBFF',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    loginBox: {
        width: '70%',
        height: '82%',
        backgroundColor: '#F2F7FD',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginHeading: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    loginLabel: {
        fontSize: 15,
        marginBottom: 10,
    },
    loginInput: {
        width: 200,
        height: 40,
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    loginButton: {
        width: '60%',
        height: 40,
        borderRadius: 10,
        marginTop: 20,
        backgroundColor: '#004CFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },
    registerLinkBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    newUserButton: {
        fontSize: 15,
        marginTop: 30,
        color: '#000',
    },
    newUserButtonLink: {
        fontSize: 15,
        marginTop: 30,
        marginLeft: 5,
        color: '#004CFB',
    },
    failure: {
        color: '#FF0000',
        fontSize: 15,
        marginTop: 10,
    }
})

export default Login