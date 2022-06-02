import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const Message = () => {
    return (
        <View style={styles.message}>
            <View style={styles.top}>
                <Image
                    source={{
                        uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.content}>lorem356</Text>
            </View>
            <View style={styles.bottom}>
                <Text style={styles.createdAt}>
                    Created At
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    message: {
        display: 'flex',
        flexDirection: 'column',
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10,
    },
    content: {
        borderRadius: 5,
        margin: 10,
        padding: 10,
        backgroundColor: '#1a059e',
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: '80%',
    },
    bottom: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 10,
    },
    createdAt: {
        fontSize: 14,
    },
})


export default Message