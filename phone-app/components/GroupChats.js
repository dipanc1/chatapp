import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Group from './Group'

const GroupChats = () => {
    return (
        <View>
            <TouchableOpacity>
                <Group />
            </TouchableOpacity>
            <TouchableOpacity>
                <Group />
            </TouchableOpacity>
            <TouchableOpacity>
                <Group />
            </TouchableOpacity>
            <TouchableOpacity>
                <Group />
            </TouchableOpacity>
        </View>
    )
}

export default GroupChats