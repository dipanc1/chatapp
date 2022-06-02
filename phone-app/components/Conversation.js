import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const Conversation = () => {
    return (
        <View style={styles.conversation}>
            <Image
                source={{
                    uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                }}
                style={styles.conversationAvatar}
            />
            <View style={styles.conversationInfo}>
                <Text style={styles.conversationName}>
                    Admin1
                </Text>

                <Text style={styles.conversationLastMessage}>
                    Lorem ipsum dolor sit 
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    conversation: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
    },
    conversationAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    conversationInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    conversationName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    conversationLastMessage: {
        fontSize: 14,
    },
});

export default Conversation