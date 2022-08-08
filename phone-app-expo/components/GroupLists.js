import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const GroupLists = ({ chat }) => {
    return (
        <View style={styles.grouplists}>
            {/* <Image
                source={{
                    uri: user.pic,
                }}
                style={styles.grouplistsAvatar}
            /> */}
            <View style={styles.grouplistsInfo}>
                <Text style={styles.grouplistsName}>
                    {chat.chatName}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    grouplists: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    grouplistsAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    grouplistsInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    grouplistsName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    grouplistsLastMessage: {
        fontSize: 14,
    },
});

export default GroupLists