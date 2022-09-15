import AsyncStorage from '@react-native-async-storage/async-storage'
import { Modal, Text } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const NavbarModal = ({ fetchAgain, setFetchAgain, showModal, setShowModal, setModalVisible }) => {
    const handleProfileModal = () => {
        setModalVisible(true)
        setShowModal(false)
    }

    const handleLogout = () => {
        setShowModal(false)
        setModalVisible(false)
        AsyncStorage.removeItem('user')
        setFetchAgain(!fetchAgain)
    }

    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} avoidKeyboard>
            <Modal.Content maxW={'24'} marginTop={'32'} marginBottom={'auto'} marginLeft={'auto'} marginRight={'5'}>
                <Modal.Body justifyContent={'center'} alignItems={'center'}>
                    <TouchableOpacity onPress={handleProfileModal}>
                        <Text my={'2'}>
                            Profile
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text my={'2'}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    )
}

export default NavbarModal