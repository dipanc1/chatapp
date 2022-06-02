import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Message from './Message';

const Chatbox = () => {
    return (
        <View style={styles.chatbox}>
            <View style={styles.menuDetails}>
                <AntDesign name="back" size={24} color="black" />
                <Image
                    source={{
                        uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.username}>Admin1</Text>
            </View>
            <View style={styles.chat}>
                <Message />
            </View>
            <View style={styles.sendMessage}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    placeholderTextColor="black"
                    underlineColorAndroid="transparent"
                />
                <TouchableOpacity>
                    <Ionicons name="send" size={24} color="black" style={styles.button} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chatbox: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    menuDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    chat: {
        flex: 9,
        padding: 10,
    },
    sendMessage: {
        flex: 1,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    button: {
        marginLeft: 10,
    },
})

export default Chatbox