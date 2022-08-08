import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
    return (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>
                {user.username}
            </Text>
            <TouchableOpacity onPress={handleFunction}>
                <Text style={styles.badgeCross}>
                X
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    badge: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#161216',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 10,
        color: 'white',
    },
    badgeCross: {
        fontSize: 10,
        marginLeft: 10,
        color: 'white',
    }
})


export default UserBadgeItem