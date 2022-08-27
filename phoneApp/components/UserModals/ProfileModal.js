import { Avatar, Button, Modal, Text, VStack } from 'native-base';
import React from 'react'

const ProfileModal = ({ showModal, setShowModal }) => {
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
      _dark: {
        bg: "coolGray.800"
      },
      bg: "warmGray.50"
    }}>
      <Modal.Content maxWidth="350" maxH="600">
        <Modal.CloseButton />
        <Modal.Header>Profile Details</Modal.Header>
        <Modal.Body>
          <VStack justifyContent={'space-between'} alignItems={'center'}>
            <Avatar bg="purple.600" alignSelf="center" size="2xl" source={{
              uri: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
            }}>
              RB
            </Avatar>
            <Text fontSize={'md'} color={'primary.600'} mt="2">Rohan Bhatt</Text>
            <Text fontSize={'md'} color={'primary.600'} mt="2"> Phone Number: +91-9888888888</Text>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button bg={'primary.300'} onPress={() => {
              setShowModal(false);
            }}>
              Close
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default ProfileModal