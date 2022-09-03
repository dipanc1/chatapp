import React from 'react'
import { Button, Flex, FormControl, HStack, Icon, Input, Text, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext';

const Settings = () => {
  const {selectedChat} = React.useContext(PhoneAppContext);

  return (
    <Flex flex={1} justifyContent={'space-around'}>
      <VStack justifyContent={'space-between'} px={4}>
        <FormControl>
          <FormControl.Label _text={{ color: 'primary.900', fontSize: 'sm', fontWeight: 'bold' }}>
            Group Name
          </FormControl.Label>
          <Input placeholder={selectedChat?.isGroupChat ? selectedChat?.chatName : "Select a Group Chat"} />
          <Button
            bg={'#EFAA86'}
            color='primary.700'
            borderRadius={'lg'}
            my={'16'}
          >
            Change Name
          </Button>
        </FormControl>
      </VStack>
      <HStack justifyContent={'space-around'}>
        <Button
          leftIcon={<MaterialIcons name="exit-to-app" size={24} color="#fff" />}
          color={'#fff'}
          borderRadius={'lg'}
          size={'lg'}
          bg={'primary.600'}>
          Leave Group
        </Button>
        <Button
          leftIcon={<MaterialIcons color="#fff" size={24} name="delete" />}
          size={'lg'}
          borderRadius={'lg'}
          bg={'primary.700'}
          color={'#fff'}>
          Delete Group
        </Button>
      </HStack>
    </Flex>
  )
}

export default Settings