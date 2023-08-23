import React from 'react'
import { Button, Flex, FormControl, HStack, Icon, Input, Text, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { backend_url } from '../../production';
import axios from 'axios';

const Settings = ({ user, fetchAgain, setFetchAgain }) => {
  const { selectedChat, dispatch, userInfo } = React.useContext(PhoneAppContext);
  const [rename, setRename] = React.useState(false);
  const [groupChatName, setGroupChatName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRename = async () => {
    if (!groupChatName) {
      return
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      const body = {
        chatName: groupChatName,
        chatId: selectedChat._id
      }
      const { data } = await axios.put(`${backend_url}/conversation/rename`, body, config)
      dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
      alert(`Group chat renamed to ${groupChatName}`)
      setFetchAgain(!fetchAgain);
      setGroupChatName('');
      setRename(false);
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemove = async (user1) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${backend_url}/conversation/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === userInfo?._id ? dispatch({ type: 'SET_SELECTED_CHAT', payload: '' }) : dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
      setFetchAgain(!fetchAgain);
      setLoading(false);
      alert('You Left the Group Chat');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Flex flex={1} justifyContent={'space-around'}>
      <VStack justifyContent={'space-between'} px={4}>
        <FormControl>
          <FormControl.Label color={'primary.900'} fontSize={'sm'} fontWeight={'bold'}>
            Group Name
          </FormControl.Label>
          <Input placeholder={selectedChat?.isGroupChat ? selectedChat?.chatName : "Select a Group Chat"} value={groupChatName} onChangeText={
            (text) => setGroupChatName(text)
          } />
          <Button
            bg={'#EFAA86'}
            color='primary.700'
            borderRadius={'lg'}
            my={'16'}
            onPress={handleRename}
            isDisabled={!groupChatName}
          >
            Change Name
          </Button>
        </FormControl>
      </VStack>
      <HStack justifyContent={'space-around'}>
        <Button
          onPress={
            () => handleRemove(user)
          }
          leftIcon={<MaterialIcons name="exit-to-app" size={24} color="#fff" />}
          color={'#fff'}
          borderRadius={'lg'}
          size={'lg'}
          bg={'primary.600'}>
          Leave Group
        </Button>
      </HStack>
    </Flex>
  )
}

export default Settings