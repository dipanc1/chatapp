import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { PhoneAppContext } from '../context/PhoneAppContext';
import { format } from 'timeago.js'


const Message = ({ messages, own, sameSender, sameTime }) => {
    const { selectedChat } = React.useContext(PhoneAppContext);
    return (
        selectedChat?._id === messages?.chat._id ? (
            <View style={own ? styles.messageown : styles.message}>
                <View style={styles.top}>
                {sameSender ? <Image
                        source={{
                            uri: messages.sender.pic,
                        }}
                        style={styles.avatar}
                    />: null}
                    <Text style={own ? styles.contentown : styles.content}>{messages.content}</Text>
                </View>
                <View style={styles.bottom}>
                    {sameTime ?
                        null
                        :
                        <Text style={styles.createdAt}>
                            {format(messages.createdAt)}
                        </Text>}
                </View>
            </View>
        ) : null
    )
}

const styles = StyleSheet.create({
    message: {
        display: 'flex',
        flexDirection: 'column',
    },
    messageown: {
        alignItems: 'flex-end',
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
        backgroundColor: '#f3f7fc',
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: '80%',
    },
    contentown: {
        borderRadius: 5,
        margin: 10,
        padding: 10,
        backgroundColor: '#b5cbfe',
        color: 'white',
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