import { Button, Spinner, Flex, HStack, ScrollView, Text, VStack } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import { backend_url } from '../../utils'
import ParticipantListItem from '../UserItems/ParticipantListItem'
import AddModal from '../UserModals/AddModal'
import axios from 'axios'

const Participants = ({ user, fetchAgain, setFetchAgain }) => {

  const { dispatch, selectedChat, userInfo } = React.useContext(PhoneAppContext);
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const admin = selectedChat?.groupAdmin?._id === userInfo?._id;

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== userInfo?._id && user1._id !== userInfo?._id) {
      return alert('You are not the admin of this group chat')
    }
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <>
      <Flex bg={'#fff'} flex={1}>

        {loading ? <Spinner size={'lg'} color={'primary.300'} /> : <>
          <HStack my={'2'} alignItems={'center'} justifyContent={'space-around'}>
            <Text color={'#2E354B'}>{selectedChat?.users.length} Members</Text>

            <Button onPress={
              () => setShowModal(true)
            } variant={'ghost'} colorScheme={'cyan'} disabled={!admin}>Add</Button>
          </HStack>

          <VStack p={'5'}>

            <ScrollView>
              {selectedChat.isGroupChat && selectedChat?.users.map(u =>
                <TouchableOpacity key={u?._id}>
                  <ParticipantListItem user1={u} admin={admin} selectedChat={selectedChat} handleRemove={handleRemove} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </VStack>
        </>}

      </Flex>

      <AddModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}

export default Participants