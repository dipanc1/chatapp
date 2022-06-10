import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const ChatOnline = ({ user1, user,handleFunction }) => {
    return (
        <View style={styles.memberBox}>
            <Image
                source={{
                    uri: user1.pic,
                }}
                style={styles.avatar}
            />
            <Text style={styles.memberText}>
                {user1.username}
            </Text>
            <View style={styles.memberButton}>
                {user._id === user1._id ? null :
                    <TouchableOpacity onPress={handleFunction}>
                        <LinearGradient
                            colors={[
                                '#8A2387',
                                '#E94057',
                                '#f27121']}
                            style={styles.memberClick}
                        >
                            <Text style={styles.text}>Remove</Text>
                        </LinearGradient>
                    </TouchableOpacity>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    memberBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    memberText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    memberButton: {
        marginLeft: 'auto',
    },
    memberClick: {
        padding: 10,
        borderRadius: 20,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default ChatOnline