import { Button, FlatList, Flex, HStack, ScrollView, Text, VStack } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import ParticipantListItem from '../UserItems/ParticipantListItem'
import UserListItem from '../UserItems/UserListItem'
import Searchbar from './Searchbar'

const Participants = ({ user }) => {

  const { dispatch, selectedChat } = React.useContext(PhoneAppContext);

  return (
    <Flex bg={'#fff'} flex={1}>

      <HStack my={'2'} alignItems={'center'} justifyContent={'space-around'}>
        <Text color={'#2E354B'}>{selectedChat?.users.length} Members</Text>
        <Button onPress={
          () => dispatch({ type: 'SET_SELECTED_CHAT', payload: null })
        } variant={'ghost'} colorScheme={'cyan'}>Add</Button>
        {/* TODO: ADD ADD USER MODAL */}
      </HStack>

      <VStack p={'5'}>

        <ScrollView>
          {selectedChat.isGroupChat && selectedChat?.users.map(u =>
            <TouchableOpacity key={u?._id}>
              <ParticipantListItem user1={u} user={user}/>
            </TouchableOpacity>
          )}
        </ScrollView>
      </VStack>

    </Flex>
  )
}

export default Participants