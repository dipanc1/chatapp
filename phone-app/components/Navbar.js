import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'


const Navbar = ({ user }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <View style={styles.navbar}>
                <View style={styles.profile}>
                    <Text style={styles.navbarText}>ChatApp</Text>
                    <View style={styles.navMenu}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Image
                                source={{
                                    uri: user.pic,
                                }}
                                style={styles.navbarAvatar}
                            />
                        </TouchableOpacity>
                        <Text style={styles.username}>{user.username}</Text>
                        <TouchableOpacity>
                            <Ionicons name="notifications" size={34} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Username: {user.username}</Text>
                            <Image
                                source={{
                                    uri: user.pic,
                                }}
                                style={styles.avatar}
                            />
                            <Text style={styles.modalText}>Phone Number: +{user.number}</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 55,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 5,
        shadowRadius: 2,
        elevation: 100,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        margin: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 50,
    }
})

export default Navbar