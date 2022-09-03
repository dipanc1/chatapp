import { Modal, Text } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const NavbarModal = ({ showModal, setShowModal, setModalVisible }) => {
    const handleProfileModal = () => {
        setModalVisible(true)
        setShowModal(false)
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
                    <TouchableOpacity>
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