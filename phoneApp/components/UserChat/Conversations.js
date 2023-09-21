import React from 'react'
import { Box, FlatList, ScrollView, Spinner } from 'native-base'
import Chatbox from './Chatbox'
import UserListItem from '../UserItems/UserListItem'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import Conversation from '../Miscellaneous/Conversation'
import { TouchableOpacity } from 'react-native'
import { backend_url } from '../../utils'
import axios from 'axios'

const Conversations = ({ fetchAgain, setFetchAgain, conversations, user, searchResultsUsers, search, setSearch, navigation, fetchMoreOneOnOneChats, hasMoreOneOnOneChats }) => {
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

  const scrollViewRef = React.useRef();

  return (
    selectedChat && !selectedChat?.isGroupChat
      ?
      <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user={user} />
      :
      search.length > 0 ?
        <ScrollView showsVerticalScrollIndicator={false}>
          {searchResultsUsers?.map((user, index) => (
            <TouchableOpacity key={user?._id} onPress={() => {
              accessChat(user?._id)
              navigation.getParent()?.setOptions({ tabBarVisible: false })
            }
            }>
              <UserListItem user={user} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        :
        <FlatList
          ref={scrollViewRef}
          onEndReached={fetchMoreOneOnOneChats}
          onEndReachedThreshold={0.5}
          ListFooterComponent={hasMoreOneOnOneChats ? <Box flex={'1'}> <Spinner size={'lg'} color={'primary.300'} /></Box> : null}
          data={conversations}
          renderItem={({ item, index }) => (
            <Conversation chat={item} navigation={navigation} />
          )}
          keyExtractor={(m) => m._id}
        />
  )
}

export default Conversations;