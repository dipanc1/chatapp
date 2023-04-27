import { Button, FlatList, Flex, HStack, ScrollView, Text, VStack } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import { backend_url } from '../../production'
import ParticipantListItem from '../UserItems/ParticipantListItem'
import AddModal from '../UserModals/AddModal'

const Participants = ({ user, fetchAgain, setFetchAgain }) => {

  const { dispatch, selectedChat } = React.useContext(PhoneAppContext);
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
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

      user1._id === user._id ? dispatch({ type: 'SET_SELECTED_CHAT', payload: '' }) : dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
      setLoading(false);
      alert('User removed from group chat');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Flex bg={'#fff'} flex={1}>

        <HStack my={'2'} alignItems={'center'} justifyContent={'space-around'}>
          <Text color={'#2E354B'}>{selectedChat?.users.length} Members</Text>
          <Button onPress={
            () => setShowModal(true)
          } variant={'ghost'} colorScheme={'cyan'}>Add</Button>
        </HStack>

        <VStack p={'5'}>

          <ScrollView>
            {selectedChat.isGroupChat && selectedChat?.users.map(u =>
              <TouchableOpacity key={u?._id}>
                <ParticipantListItem user1={u} user={user} handleRemove={handleRemove} />
              </TouchableOpacity>
            )}
          </ScrollView>
        </VStack>

      </Flex>

      <AddModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}

export default Participants