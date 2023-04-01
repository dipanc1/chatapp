import React from 'react'
import { Button } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutButton = ({ setUser, setFetchAgain, fetchAgain }) => {
    return (
        <>
            <Button title="Logout" onPress={() => {
                AsyncStorage.removeItem('user')
                setUser(null)
                setFetchAgain(!fetchAgain)
            }} />
        </>
    )
}

export default LogoutButton