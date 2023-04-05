import { View, Text } from 'react-native'
import React from 'react'
import { Modal } from 'native-base'

const JoinGroupModal = () => {
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
            _dark: {
                bg: "coolGray.800"
            },
            bg: "warmGray.50"
        }}>
            <Modal.Header>
                <Text color={'primary.600'} fontSize={'2xl'} bold>You have to join {chatName} group to join this event?</Text>
            </Modal.Header>
            <Modal.Content maxWidth="350" maxH="800">
                <Modal.Body>

                    <Text>
                        Are you sure you want to join this group? You can always leave later.
                    </Text>

                    <Button variant={'outline'} colorScheme="violet" rounded={'lg'} w={'100%'}>
                        No
                    </Button>
                    <Button rounded={'lg'} bg={'primary.300'} w={'100%'}>
                        Yes
                    </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal >
    )
}

export default JoinGroupModal