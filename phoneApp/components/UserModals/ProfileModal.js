import { Button, Modal, Text, VStack } from 'native-base';
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { Image } from 'react-native';

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
            <Image
              source={{
                uri: userInfo?.pic
              }}
              alt={userInfo?.username}
              size={"2xl"}
              resizeMode={"stretch"}
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                alignSelf: "center"
              }}
            />
            <Text fontSize={'md'} color={'primary.600'} mt="2">{userInfo?.username}</Text>
            <Text fontSize={'md'} color={'primary.600'} mt="2"> Phone Number: +{userInfo?.number}</Text>
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