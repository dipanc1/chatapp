import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert, Pressable, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhoneAppContext } from '../context/PhoneAppContext';


const Navbar = ({ user }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [notificationModal, setNotificationModal] = useState(false);
    const { notification, dispatch } = React.useContext(PhoneAppContext);

    return (
        <>
            <View style={styles.navbar}>
                <View style={styles.profile}>
                    <Text style={styles.navbarText}>ChatApp</Text>
                    <View style={styles.navMenu}>

                        <TouchableOpacity onPress={() => setModalVisible1(true)}>
                            <Image
                                source={{
                                    uri: user.pic,
                                }}
                                style={styles.navbarAvatar}
                            />
                        </TouchableOpacity>
                        <Text style={styles.username}>{user.username}</Text>

                        <TouchableOpacity
                            onPress={() => setNotificationModal(!notificationModal)}>
                            <Ionicons name="notifications" size={34} color="black" />
                            {notification?.length > 0 ?
                                <View style={styles.notification}>
                                    <Text style={styles.notificationNumber}>
                                        {notification?.length}
                                    </Text>
                                </View>
                                : null}
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => {
                        setModalVisible1(!modalVisible1);
                    }}>
                    <View style={styles.centeredView1}>
                        <View style={styles.modalView1}>
                            <TouchableOpacity
                                onPress={
                                    () => {
                                        setModalVisible1(!modalVisible1);
                                        setModalVisible(!modalVisible);
                                    }
                                }
                            >
                                <Text style={styles.modalText1}>Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={
                                    () => {
                                        AsyncStorage.clear();
                                    }
                                }
                            >
                                <Text style={styles.modalText1}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
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

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={notificationModal}
                    onRequestClose={() => {
                        setNotificationModal(!notificationModal);
                    }}>
                    <View style={styles.centeredViewNotification}>
                        <View style={styles.modalViewNotification}>
                            {!notification?.length ?
                                <Text style={styles.modalTextNotification}>
                                    No notifications
                                </Text>
                                :
                                notification?.map((notifications, index) => {
                                    <TouchableOpacity
                                        style={styles.modalNotification}
                                        key={notifications._id}
                                        onClick={() => {
                                            console.log(notifications);
                                            setShow(!show);
                                            dispatch({
                                                type: 'SET_SELECTED_CHAT',
                                                payload: notifications.chat
                                            })
                                            dispatch({
                                                type: 'SET_NOTIFICATION',
                                                payload: notifications.filter(notifications._id !== notification._id)
                                            })
                                        }}
                                    >
                                        <Text style={styles.modalTextNotification}>
                                            {notifications.chat.isGroupChat ? `New Message in ${notifications.chat.chatName}` : `New Message from ${notifications.sender.username}`}
                                        </Text>
                                    </TouchableOpacity>
                                })
                            }
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
    centeredView1: {
        // flex: 1,
        marginLeft: '65%',
        marginTop: StatusBar.currentHeight - 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView1: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
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
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText1: {
        margin: 15,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 50,
    },
    centeredViewNotification: {
        marginTop: StatusBar.currentHeight - 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalViewNotification: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
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
    modalTextNotification: {
        margin: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    notification:{
        position: 'relative',
        top: -10,
        left: -10,
        backgroundColor: 'red',
        borderRadius: 20,
    },
    notificationNumber: {
        position: 'absolute',
        top: -10,
        color: 'white',
    }
})

export default Navbar