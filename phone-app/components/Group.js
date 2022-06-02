import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const Group = () => {
    return (
        <View style={styles.group}>
            {/* <Image
                source={{
                    uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                }}
                style={styles.groupAvatar}
            /> */}
            <View style={styles.groupInfo}>
                <Text style={styles.groupName}>
                    New Group
                </Text>

                <Text style={styles.groupLastMessage}>
                    Lorem ipsum dolor sit amet, 
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    group: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
    },
    groupAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    groupInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    groupName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    groupLastMessage: {
        fontSize: 14,
    },
});

export default Group