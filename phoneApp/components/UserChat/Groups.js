import React, { useState } from 'react'
import { Avatar, Box, FlatList, Flex, HStack, IconButton, ScrollView, Spacer, Spinner, Text, VStack } from 'native-base'
import Members from './Members'
import axios from 'axios'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GroupChatModal from '../UserModals/GroupChatModal'
import GroupListItem from '../UserItems/GroupListItem'
import { TouchableOpacity } from 'react-native'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import { backend_url } from '../../production'

const Groups = ({ user, groupConversations, searchResultsGroups, search, setSearch, fetchAgain, setFetchAgain, admin, fetchMoreGroupChats, hasMoreGroupChats, navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { dispatch, selectedChat, userInfo } = React.useContext(PhoneAppContext);

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

  const scrollViewRef = React.useRef();

  return (
    <>
      {selectedChat && selectedChat?.isGroupChat ?
        <Members admin={admin} user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        :
        search.length > 0 ?
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              (
                searchResultsGroups.map((group, index) => (
                  <TouchableOpacity key={group._id}
                    onPress={() => handleAddUser(userInfo._id, group._id)}>
                    <Flex justifyContent={'flex-start'} p={'2'}>
                      <GroupListItem group={group} />
                    </Flex>
                  </TouchableOpacity>
                ))
              )
            }
          </ScrollView>
          :
          <>
            <FlatList
              ref={scrollViewRef}
              onEndReached={fetchMoreGroupChats}
              onEndReachedThreshold={0.5}
              ListFooterComponent={hasMoreGroupChats ? <Box flex={'1'}> <Spinner size={'lg'} color={'primary.300'} /></Box> : null}
              data={groupConversations}
              renderItem={({ item, i }) => (
                <Flex justifyContent={'flex-start'} p={'2'}>
                  <GroupListItem group={item} navigation={navigation} />
                </Flex>
              )}
              keyExtractor={(m) => m._id}
            />


            <Box position={'absolute'} bottom={'5'} right={'5'}>
              <IconButton onPress={() => setShowModal(true)} colorScheme={'cyan'} size={'md'} variant={"outline"} _icon={{ as: MaterialIcons, name: "add", size: "lg" }} />
            </Box>
            <GroupChatModal showModal={showModal} setShowModal={setShowModal} user={userInfo} />
          </>
      }
    </>
  )
}

export default Groups