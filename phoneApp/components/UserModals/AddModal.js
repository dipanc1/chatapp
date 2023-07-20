import axios from 'axios';
import { Avatar, Badge, Button, FormControl, Input, Modal, ScrollView, Text, View, VStack } from 'native-base';
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { backend_url } from '../../production';
import Searchbar from '../Miscellaneous/Searchbar';
import UserListItem from '../UserItems/UserListItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AddModal = ({ user, showModal, setShowModal, fetchAgain, setFetchAgain, chat }) => {
  const { dispatch, selectedChat, userInfo } = React.useContext(PhoneAppContext);
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

  const handleAddUser = async (user1) => {
    if (selectedChat !== null) {
      if (selectedChat.groupAdmin._id !== userInfo?._id) {
        return alert("You are not the admin")
      }
      if (selectedChat.users.map(user => user._id).includes(user1)) {
        return alert('User already in chat')
      }
    } else {
      if (chat.groupAdmin._id !== userInfo?._id) {
        return alert("You are not the admin")
      }
      if (chat.users.map(user => user._id).includes(user1)) {
        return alert('User already in chat')
      }
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
          chatId: selectedChat !== null ? selectedChat._id : chat._id,
          userId: user1,
        },
        config
      );
      // console.log(data);
      dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
      setFetchAgain(!fetchAgain);
      setLoading(false);
      setShowModal(false);
      setSearchResults([])
      alert('User added to chat');
    } catch (error) {
      console.log(error);
    }
    setSearch('');

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
            <Text color={'#42495d'} fontSize={'2xl'} bold>User Search</Text>
            <Text color={'#42495d'}>Search for a person to add in group</Text>
            <FormControl>
              <FormControl.Label>Add a Member</FormControl.Label>
              <Input variant={'filled'} color={'primary.900'} placeholder="Search users" value={search} onChangeText={text => handleSearch(text)} />
            </FormControl>

            <ScrollView maxH={'32'}>
              {searchResults?.map((user, index) => (
                <TouchableOpacity key={user._id} onPress={() => handleAddUser(user._id)}>
                  <UserListItem
                    user={user}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Button variant={'outline'} colorScheme="violet" rounded={'lg'} w={'100%'} onPress={() => setShowModal(false)}>
              Cancel
            </Button>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default AddModal