import { Avatar, Button, Flex, HStack, Modal, Text, VStack } from 'native-base';
import React from 'react'

const ProfileModal = ({ user, modalVisible, setModalVisible, navigation }) => {

  return (
    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} _backdrop={{
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
              uri: user.pic
            }}>
              {user.username}
            </Avatar>
            <Text fontSize={'md'} color={'primary.600'} mt="2">{user.username}</Text>
            <Text fontSize={'md'} color={'primary.600'} mt="2"> Phone Number: +{user.number}</Text>
          </VStack>
        </Modal.Body>
        <Modal.Footer justifyContent={'center'}>
          <Button bg={'primary.300'} onPress={() => {
            navigation.navigate(`Settings`);
          }}>
            Edit Profile
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default ProfileModal