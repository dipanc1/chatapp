import React from 'react'
import { Avatar, Box, FlatList, HStack, ScrollView, Spacer, Text, VStack } from 'native-base'
import Chatbox from './Chatbox'
import UserListItem from '../UserItems/UserListItem'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import Conversation from '../Miscellaneous/Conversation'
import { TouchableOpacity } from 'react-native'

const Conversations = ({ fetchAgain, setFetchAgain, conversations, user, searchResultsUsers, search, setSearch }) => {
  const { dispatch, selectedChat } = React.useContext(PhoneAppContext);

  // add user to conversation
  const accessChat = async (userId) => {
    // console.log(userId);
    try {
      // setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      const { data } = await axios.post(`${backend_url}/conversation`, { userId }, config);

      dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
      // console.log(data);
      // setLoading(false);
      setSearch('');
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    selectedChat && !selectedChat?.isGroupChat
      ?
      <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user={user} />
      :
      <ScrollView showsVerticalScrollIndicator={false}>
        {search.length > 0 ?
          searchResultsUsers?.map((user, index) => (
            <TouchableOpacity key={user?._id} onPress={
              () => accessChat(user?._id)
            }>
              <UserListItem user={user} />
            </TouchableOpacity>
          ))
          : conversations.map((chat, index) => (
            <TouchableOpacity key={chat?._id} onPress={
              () => dispatch({ type: 'SET_SELECTED_CHAT', payload: chat })
            }>
              <Conversation user={user} chat={chat} />
            </TouchableOpacity>
          ))}
      </ScrollView>

  )
}

export default Conversations;