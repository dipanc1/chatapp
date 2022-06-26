import React from 'react'
import ChatOnline from '../chatOnline/ChatOnline'
import "./members.scss"
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import { backend_url } from '../../production'
import { HiUserRemove } from 'react-icons/hi'
import {
  Avatar,
  Box, Button, Divider, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast,
} from '@chakra-ui/react'
import { GrUserAdd } from 'react-icons/gr'

const Members = ({ fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false)
  const [transformmm, setTransformmm] = React.useState(false);
  const toast = useToast();
  const { selectedChat, dispatch } = React.useContext(PhoneNumberContext);
  const user = JSON.parse(localStorage.getItem('user'));
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      return toast({
        title: "Error Occured!",
        description: "You are not the admin of this group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
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
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: "Success!",
        description: "Member Removed",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Remove Member",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const handleAddUser = async (user1) => {
    // console.warn("USER ID TO ADD", selectedChat.users.map(user => user._id).includes(user1));
    if (selectedChat.users.map(user => user._id).includes(user1)) {
      return toast({
        title: "Error Occured!",
        description: "User already in group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Error Occured!",
        description: "You are not the admin of this group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
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
          chatId: selectedChat._id,
          userId: user1,
        },
        config
      );
      console.log(data);
      dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: "Success!",
        description: "User added to group chat",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to add user to group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setSearch('');

  }

  const handleRename = async () => {
    if (!groupChatName) {
      return
    }

    try {
      setRenameLoading(true);
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
      toast({
        title: "Group chat renamed",
        description: "Group chat renamed to " + groupChatName,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName('');
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Rename Group Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
    }
  }

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
      setSearchResults(data.users);
      // console.log(searchResults);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }


  return (
    <Box
      height={'628px'}
      width={'98%'}
      bg={'white'}
      p={'1.5'}
      my={'5'}
      mr={'10'}
      borderRadius={'xl'}
      boxShadow={'dark-lg'}>
      {selectedChat ? (
        <>
          <Box
            p={2}
            mx={'2'}
            my={'1'}
            flexWrap={'wrap'}
            display={'flex'}
            justifyContent={'space-around'}
            alignItems={'center'}>
            {selectedChat.isGroupChat ?
              <>
                <Text as='kbd' fontSize={'lg'}> Group Info: </Text>
                <Text as='samp' color={'#004dfa'}>{selectedChat?.chatName}</Text>
              </>
              :
              <>
                <Text as='kbd' fontSize={'lg'}>Personal Info: </Text>
                <Text as='samp' color={'#004dfa'}>{selectedChat?.users.find(member => member._id !== user._id)?.username}</Text>
              </>
            }
          </Box>

          <Divider orientation='horizontal' />

          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            maxHeight={'sm'}
            overflow={selectedChat.isGroupChat && 'scroll'}
            minHeight={'sm'}
            overflowX={'hidden'}
          >

            {selectedChat.isGroupChat && selectedChat?.users.map(u =>
              <Box my={'2'} key={u._id}>
                <ChatOnline
                  user1={u}
                  handleFunction={() => handleRemove(u)} />
              </Box>
            )}

            {!selectedChat.isGroupChat && (
              <>
                <Avatar my={'10'} size={'2xl'} name={selectedChat?.users.find(member => member._id !== user._id)?.username} src={selectedChat?.users.find(member => member._id !== user._id)?.pic} />
                <Text as='kbd' fontSize={'lg'}>Phone Number:</Text>
                <Text as='samp' color={'#004dfa'}>
                  {selectedChat?.users.find(member => member._id !== user._id)?.number}
                </Text>
              </>
            )}
          </Box>


          {selectedChat.isGroupChat &&
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Box my={'2'}>
                <Button onClick={onOpen} rightIcon={<GrUserAdd />} colorScheme='blue' variant='outline'>
                  Add Member
                </Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add Member</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody maxHeight={'lg'} overflow={'scroll'} overflowX={'hidden'}>
                      <Input
                        value={search}
                        placeholder="Search Member" onChange={handleSearch}
                      />
                      {loading
                        ?
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} my={2}>
                          <Spinner
                            thickness='4px'
                            speed='0.6s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                          />
                        </Box>
                        :
                        search.length > 0 &&
                        searchResults?.map(user => (
                          <Box my={'2'}
                            _hover={{
                              background: '#b5cbfe',
                              color: 'white',
                            }}
                            bg={'#E8E8E8'}
                            p={2}
                            cursor={'pointer'}
                            mx={'2rem'}
                            borderRadius="lg"
                            key={user._id}
                            onClick={() => handleAddUser(user._id)}
                          >
                            <UserListItem user={user}
                            />
                          </Box>
                        ))}
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Box>

              {renameLoading ?
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} my={2}>
                  <Spinner
                    thickness='4px'
                    speed='0.7s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='md'
                  />
                </Box>
                :
                <Box display={'flex'} mx={'2'}>
                  <Input
                    mr={'2'}
                    value={groupChatName}
                    placeholder="Change Group Name"
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button colorScheme={'blue'} onClick={handleRename}>
                    Rename
                  </Button>
                </Box>
              }
              <Box my={'2'}>
                <Button onClick={() => handleRemove(user)} rightIcon={<HiUserRemove />} colorScheme='red' variant='outline'>
                  Leave Group
                </Button>
              </Box>
            </Box>
          }
        </>
      )
        :
        (<Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'100%'}
        >
          <Text Text cursor={'default'} color={'blue'} fontSize={'2xl'}>
            No Chat is Selected
          </Text>
        </Box>)}
    </Box>
  )
}

export default Members