import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'


const Navbar = () => {
    return (
        <View style={styles.navbar}>
            <View style={styles.profile}>
                <Text style={styles.navbarText}>ChatApp</Text>
                <View style={styles.navMenu}>
                    <TouchableOpacity>
                        <Image
                            source={{
                                uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                            }}
                            style={styles.navbarAvatar}
                        />
                    </TouchableOpacity>
                    <Text style={styles.username}>Admin1</Text>
                    <TouchableOpacity>
                        <Ionicons name="notifications" size={34} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#f8f8f8',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    profile: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navbarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    navbarAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    navMenu: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '45%',
    },
})

export default Navbar