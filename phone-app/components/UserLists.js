import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const UserLists = ({ user }) => {


    return (
        <View style={styles.userlists}>
            <Image
                source={{
                    uri: user?.pic,
                }}
                style={styles.userlistsAvatar}
            />
            <View style={styles.userlistsInfo}>
                <Text style={styles.userlistsName}>
                    {user?.username}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    userlists: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    userlistsAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userlistsInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    userlistsName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userlistsLastMessage: {
        fontSize: 14,
    },
});

export default UserLists