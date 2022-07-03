import React from 'react'
import ChatOnline from '../chatOnline/ChatOnline'
import "./members.scss"
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import { backend_url } from '../../production'
import { HiUserRemove } from 'react-icons/hi'
import {
  Accordion,
  Avatar,
  Box, Button, Divider, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, useToast,
} from '@chakra-ui/react'
import { GrUserAdd } from 'react-icons/gr'
import { BsTelephone, BsPerson } from 'react-icons/bs'

export const MembersComponent = ({ fetchAgain, setFetchAgain }) => {
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
    selectedChat ? (
      selectedChat?.isGroupChat ? (
        <Tabs variant='unstyled' isFitted>
          <TabList>
            <Tab _selected={{ color: 'white', bg: 'buttonPrimaryColor', borderRadius: '1rem' }}>Participants</Tab>
            <Tab _selected={{ color: 'white', bg: 'buttonPrimaryColor', borderRadius: '1rem' }}>Settings</Tab>
          </TabList>

          <TabPanels>

            <TabPanel>
              <Box>
                <Text>
                  {selectedChat?.users.length} members
                </Text>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                minHeight={'10'}
                maxHeight={'72vh'}
                overflowY={'scroll'}
                overflowX={'hidden'}
              >
                <Accordion allowToggle>
                  {selectedChat?.users.map(u =>
                    <ChatOnline
                      key={u._id}
                      user1={u}
                      handleFunction={() => handleRemove(u)} />
                  )}
                </Accordion>
              </Box>
            </TabPanel>

            <TabPanel>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'flex-end'}
                maxHeight={'sm'}
                minHeight={'75vh'}
              >

                {renameLoading ?
                  <Box display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    my={2}>
                    <Spinner
                      thickness='4px'
                      speed='0.7s'
                      emptyColor='gray.200'
                      color='buttonPrimaryColor'
                      size='md'
                    />
                  </Box>
                  :
                  <Box display={'flex'} flexDirection={'column'} mx={'2'} mb={'36'}>
                    <Input
                      mr={'2'}
                      value={groupChatName}
                      placeholder={selectedChat?.chatName}
                      _placeholder={{ color: 'inherit' }}
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button mt={'4'} color={'white'} backgroundColor={'buttonPrimaryColor'} onClick={handleRename}>
                      Rename
                    </Button>
                  </Box>
                }

                <Box my={'2'}>

                  <Button onClick={onOpen} rightIcon={<GrUserAdd />} color={'buttonPrimaryColor'} variant='outline'>
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
                              color='buttonPrimaryColor'
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

                <Box my={'2'}>
                  <Button onClick={() => handleRemove(user)} rightIcon={<HiUserRemove />} colorScheme='red' variant='outline'>
                    Leave Group
                  </Button>
                </Box>

              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <>
          <Box
            p={2}
            mx={'2'}
            my={'1'}
            flexWrap={'wrap'}
            display={'flex'}
            justifyContent={'space-around'}
            alignItems={'center'}>
            <Text as='kbd' fontSize={'lg'}>Personal Information </Text>
          </Box>
          <Divider orientation='horizontal' />

          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            maxHeight={'sm'}
            minHeight={'sm'}
            overflowX={'hidden'}
          >
            <Avatar my={'10'} size={'2xl'} name={selectedChat?.users.find(member => member._id !== user._id)?.username} src={selectedChat?.users.find(member => member._id !== user._id)?.pic} />

            <BsPerson />
            <Text as='samp' mb={'5'}>
              {selectedChat?.users.find(member => member._id !== user._id)?.username}
            </Text>

            <BsTelephone />
            <Text as='samp'>
              {selectedChat?.users.find(member => member._id !== user._id)?.number}
            </Text>

          </Box>
        </>
      )

    )
      :
      (<Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}

        height={'100%'}
      >
        <Text cursor={'default'} color={'buttonPrimaryColor'} fontSize={'2xl'}>
          Select a chat
        </Text>
        <Text color={'greyTextColor'} p={'4'}>
          Select or create a group to see the participants of that group along with settings and other information.
        </Text>
      </Box>)
  )
}

const Members = ({ fetchAgain, setFetchAgain }) => {



  return (
    <Box
      height={'628px'}
      width={'98%'}
      bg={'whiteColor'}
      p={'1.5'}
      my={'5'}
      mr={'10'}
      borderRadius={'xl'}
      display={['none', 'none', 'none', 'block']}
      boxShadow={'dark-lg'}>

      <MembersComponent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

    </Box>
  )
}

export default Members