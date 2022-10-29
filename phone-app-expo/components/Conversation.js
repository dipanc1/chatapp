import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { format } from 'timeago.js';

const Conversation = ({ chat, user }) => {

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        setFriends((chat.users.find(member => member._id !== user._id)))
    }, [chat, friends, user._id])

    return (
        <View style={styles.conversation}>
            <Image
                source={{
                    uri: chat && friends?.pic,
                }}
                style={styles.conversationAvatar}
            />
            <View style={styles.conversationInfo}>
                <Text style={styles.conversationName}>
                    {chat && friends?.username}
                </Text>

                <Text style={styles.conversationLastMessage}>
                    {chat.latestMessage && chat?.latestMessage.content}
                </Text>
            </View>
            <View style={styles.conversationTime}>
                <Text style={styles.conversationTimeText}>
                    {chat.latestMessage && format(chat?.latestMessage.createdAt)}
                </Text>
            </View>
            <View style={styles.conversationUnread}>
                <Text style={styles.conversationUnreadText}>
                    {/* {chat.unreadMessages} */}
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
    conversationTime: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
    },
    conversationTimeText: {
        fontSize: 12,
        color: '#8c8c8c',
    }
});

export default Conversation