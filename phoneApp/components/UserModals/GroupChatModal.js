import { Avatar, Button, FormControl, Input, Modal, Text, VStack } from 'native-base';
import React from 'react'

const GroupChatModal = ({ showModal, setShowModal }) => {
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
      _dark: {
        bg: "coolGray.800"
      },
      bg: "warmGray.50"
    }}>
      <Modal.Content maxWidth="350" maxH="800">
        <Modal.Body>
          <VStack space={4} alignItems={'center'}>
            <Text color={'primary.600'} fontSize={'2xl'} bold>Create a new Group</Text>
            <Text color={'primary.600'}>You can add any users to this group</Text>
            <FormControl>
              <FormControl.Label>Group Name</FormControl.Label>
              <Input variant={'filled'} color={'primary.900'} placeholder="Group name" />
            </FormControl>
            <FormControl>
              <FormControl.Label>Add Users</FormControl.Label>
              <Input variant={'filled'} color={'primary.900'} placeholder="Search users" />
            </FormControl>

            <Button rounded={'lg'} bg={'primary.300'} w={'100%'} onPress={() => setShowModal(false)}>
              Create
            </Button>
            <Button variant={'outline'} colorScheme="violet" rounded={'lg'} w={'100%'} onPress={() => setShowModal(false)}>
              Cancel
            </Button>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default GroupChatModal