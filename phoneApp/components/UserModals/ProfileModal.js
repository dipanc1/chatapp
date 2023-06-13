import { Avatar, Button, Flex, HStack, Modal, Text, VStack } from 'native-base';
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';

const ProfileModal = ({ modalVisible, setModalVisible, navigation }) => {
  const { userInfo } = React.useContext(PhoneAppContext);

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
              uri: userInfo?.pic
            }}>
              {userInfo?.username}
            </Avatar>
            <Text fontSize={'md'} color={'#42495d'} mt="2">{userInfo?.username}</Text>
            <Text fontSize={'md'} color={'#42495d'} mt="2"> Phone Number: +{userInfo?.number}</Text>
          </VStack>
        </Modal.Body>
        <Modal.Footer justifyContent={'center'}>
          <Button bg={'primary.300'} onPress={() => {
            navigation.navigate(`Settings`, { screen: `My Details` })
          }}>
            Edit Profile
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default ProfileModal