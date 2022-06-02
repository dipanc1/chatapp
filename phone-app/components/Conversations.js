import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Conversation from './Conversation'

const Conversations = () => {
    return (
        <View>
            <TouchableOpacity>
                <Conversation />
            </TouchableOpacity>
            <TouchableOpacity>
                <Conversation />
            </TouchableOpacity>
            <TouchableOpacity>
                <Conversation />
            </TouchableOpacity>
            <TouchableOpacity>
                <Conversation />
            </TouchableOpacity>
        </View>
    )
}



export default Conversations