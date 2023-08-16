import axios from 'axios';
import { Badge, Button, FormControl, HStack, Input, Modal, ScrollView, Text, View, VStack } from 'native-base';
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { backend_url } from '../../production';
import Searchbar from '../Miscellaneous/Searchbar';
import UserListItem from '../UserItems/UserListItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GroupChatModal = ({ user, showModal, setShowModal }) => {
  const { dispatch, chats } = React.useContext(PhoneAppContext);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
      // console.log(data.users);
      setLoading(false);
      setSearchResults(data.users);
    } catch (error) {
      console.log(error)
    }
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert('already added');
    } else {
      setSelectedUsers([...selectedUsers, userToAdd])
    }
  }

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id))
  }

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
      _dark: {
        bg: "coolGray.800"
      },
      bg: "warmGray.50"
    }}>
      <Modal.Content maxWidth="350" maxH="800">
        <Modal.Body>
          <VStack space={4} alignItems={'center'}>
            <Text color={'primary.600'} fontSize={'2xl'} bold>Create a new Group</Text>
            <Text color={'primary.600'}>You can add any users to this group</Text>
            <FormControl>
              <FormControl.Label>Group Name</FormControl.Label>
              <Input variant={'filled'} color={'primary.900'} placeholder="Group name" />
            </FormControl>
            <FormControl>
              <FormControl.Label>Add Users</FormControl.Label>
              <Input variant={'filled'} color={'primary.900'} placeholder="Search users" search={search} setSearch={setSearch} onChangeText={text => handleSearch(text)} />
            </FormControl>

            <HStack space={'1'} flexWrap={'wrap'}>
              {selectedUsers.map(user =>
                <Badge key={user._id} my={'1'} bgColor={'#3cc4b7'}>
                  <Text>
                    {user.username}
                    <MaterialIcons name="close" size={20} color="#fff" onPress={() => handleDelete(user)} />
                  </Text>
                </Badge>
              )}
            </HStack>

            <ScrollView maxH={'32'}>
              {searchResults?.map((user, index) => (
                <TouchableOpacity key={user._id} onPress={() => handleGroup(user)}>
                  <UserListItem
                    user={user}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Button rounded={'lg'} bg={'primary.300'} w={'100%'} onPress={() => setShowModal(false)}>
              Create
            </Button>
            <Button variant={'outline'} colorScheme="violet" rounded={'lg'} w={'100%'} onPress={() => {
              setShowModal(false)
              setSelectedUsers([])
              setSearchResults([])
            }}>
              Cancel
            </Button>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default GroupChatModal