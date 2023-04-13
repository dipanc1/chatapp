import React, { useState } from 'react'
import { Avatar, Box, FlatList, Flex, HStack, IconButton, ScrollView, Spacer, Text, VStack } from 'native-base'
import Members from './Members'
import axios from 'axios'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GroupChatModal from '../UserModals/GroupChatModal'
import GroupListItem from '../UserItems/GroupListItem'
import { TouchableOpacity } from 'react-native'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import { backend_url } from '../../production'

const Groups = ({ user, groupConversations, searchResultsGroups, search, setSearch, fetchAgain, setFetchAgain }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const { dispatch, selectedChat } = React.useContext(PhoneAppContext)

  const handleAddUser = async (user1, groupId) => {
    const res = searchResultsGroups.map(group => group.users).includes(user1);
    if (res) {
      alert('User already in chat')
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${backend_url}/conversation/groupadd`,
        {
          chatId: groupId,
          userId: user1,
        },
        config
      );
      // console.log(data);
      dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setSearch('');

  }

  return (
    <>
      {selectedChat && selectedChat?.isGroupChat ?
        <Members user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        :
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              (search.length > 0 ?
                searchResultsGroups.map((group, index) => (
                  <TouchableOpacity key={group._id}
                    onPress={() => handleAddUser(user._id, group._id)}>
                    <Flex justifyContent={'flex-start'} p={'2'}>
                      <GroupListItem group={group} />
                    </Flex>
                  </TouchableOpacity>
                ))
                :
                groupConversations.map((group, index) => (
                  <TouchableOpacity key={group._id}
                    onPress={() => dispatch({ type: 'SET_SELECTED_CHAT', payload: group })}>
                    <Flex justifyContent={'flex-start'} p={'2'}>
                      <GroupListItem group={group} />
                    </Flex>
                  </TouchableOpacity>
                ))
              )
            }




          </ScrollView>


          <Box position={'absolute'} bottom={'5'} right={'5'}>
            <IconButton onPress={() => setShowModal(true)} colorScheme={'cyan'} size={'md'} variant={"outline"} _icon={{ as: MaterialIcons, name: "add", size: "lg" }} />
          </Box>
          <GroupChatModal showModal={showModal} setShowModal={setShowModal} user={user} />
        </>}
    </>
  )
}

export default Groups