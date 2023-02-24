import React, {
  useContext,
  useState,
} from 'react'
import ChatOnline from '../Miscellaneous/ChatOnline'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import UserListItem from '../UserItems/UserListItem'
import { backend_url } from '../../baseApi'
import { HiUserRemove } from 'react-icons/hi'
import {
  Accordion, Avatar,
  Box, Button, Checkbox, Divider, Flex, FormControl, FormLabel, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, useDisclosure, useToast,
} from '@chakra-ui/react'
import { GrUserAdd } from 'react-icons/gr'
import { BsTelephone, BsPerson } from 'react-icons/bs'
import { ChatBoxComponent } from './Chatbox'
import EndLeaveModal from '../UserModals/EndLeaveModal'
import { RoomContext } from '../../context/RoomContext'
import EventCard from '../Events/EventCard'
import { NavLink } from 'react-router-dom'

import { useNavigate } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import EventModal from '../UserModals/EventModal'

export const MembersComponent = ({ token, meetingId, fetchAgain, setFetchAgain, admin }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { selectedChat, dispatch, stream, fullScreen } = React.useContext(AppContext);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isOpenCreateEvent, onOpen: onOpenCreateEvent, onClose: onCloseCreateEvent } = useDisclosure()

  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()

  const cancelRef = React.useRef()

  const toast = useToast();

  const [groupChatName, setGroupChatName] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [createEventLoading, setCreateEventLoading] = useState(false)

  const fileInputRef = React.createRef();

  const cloudName = 'dipanc1';
  const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png')) {
      setSelectedImage(e.target.files[0]);
    } else {
      alert('Please select a valid image file');
    }
  }

  const handleCreateEvent = async (e) => {
    setCreateEventLoading(true)
    e.preventDefault();

    if (selectedChat.groupAdmin._id !== user._id) {
      setCreateEventLoading(false)
      toast({
        title: "Error Occured!",
        description: "You are not the admin of this group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setEventName("");
      setDescription("");
      setDate("");
      setTime("");
      setSelectedImage(null);
      return;
    }

    if (name === "" || description === "" || date === "" || time === "") {
      setCreateEventLoading(false)
      toast({
        title: "Error Occured!",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };


    if (selectedImage === null) {
      await axios.put(`${backend_url}/conversation/event/${selectedChat._id}`, {
        name,
        description,
        date,
        time
      }, config)
        .then((res) => {
          toast({
            title: "Event Created!",
            description: "Event created successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setFetchAgain(!fetchAgain);
          setCreateEventLoading(false);
          setEventName("");
          setDescription("");
          setDate("");
          setTime("");
          setSelectedImage(null);
          onCloseCreateEvent();
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Error Occured!",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setCreateEventLoading(false);
          setEventName("");
          setDescription("");
          setDate("");
          setTime("");
          setSelectedImage(null);
          onCloseCreateEvent();
        });
    } else {
      const formData = new FormData();
      formData.append('api_key', '835688546376544')
      formData.append('file', selectedImage);
      formData.append('upload_preset', 'chat-app');

      await axios.post(pictureUpload, formData)
        .then((res) => {
          axios.put(`${backend_url}/conversation/event/${selectedChat._id}`, {
            name,
            description,
            date,
            time,
            thumbnail: res.data.url
          }, config)
            .then((res) => {
              toast({
                title: "Event Created!",
                description: "Event created successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
              setFetchAgain(!fetchAgain);
              setCreateEventLoading(false);
              setEventName("");
              setDescription("");
              setDate("");
              setTime("");
              setSelectedImage(null);
              onCloseCreateEvent();
            })
            .catch((err) => {
              console.log(err);
              toast({
                title: "Error Occured!",
                description: "Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
              setCreateEventLoading(false);
              setEventName("");
              setDescription("");
              setDate("");
              setTime("");
              setSelectedImage(null);
              onCloseCreateEvent();
            });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Error Occured!",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setCreateEventLoading(false);
          setEventName("");
          setDescription("");
          setDate("");
          setTime("");
          setSelectedImage(null);
          onCloseCreateEvent();
        });
    }

  }

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
      return toast({
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
      // console.log(data);
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
      setRenameLoading(false);
      setGroupChatName('');
      setFetchAgain(!fetchAgain);
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
        <Tabs display='flex' flexDirection='column' h='100%'>
          <TabList mt={['2', '0', '0', '0']}>
            {/* {(token && meetingId && stream) &&
              <Tab boxSize={fullScreen ? '10' : '1'} _selected={{ color: 'white', bg: 'buttonPrimaryColor', borderRadius: '1rem' }}>Chat</Tab>
            } */}
            {stream &&
              <Tab flex='1'>Chat</Tab>
            }

            <Tab flex='1'>Events</Tab>

            <Tab flex='1'>{stream ? 'Participants' : 'Members'}</Tab>

            <Tab display='none' flex='1'>Settings</Tab>
          </TabList>

          <TabPanels flex='1' h='80%'>

            {/* Chat Tab */}
            {stream &&
              <TabPanel>
                <ChatBoxComponent height={fullScreen ? '65vh' : '20vh'} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} selectedChat={selectedChat} user={user} toast={toast} />
              </TabPanel>
            }

            {/* Events Tab */}
            <TabPanel h='100%' p='0'>

              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                height='100%'
              >
                <Box
                  h='50%'
                  overflow='auto'
                  flex='1'
                  p='4'
                >
                  {selectedChat?.events.map((eventItem) => {
                    return (
                      <>
                        <Box key={eventItem._id} className='group-event' mb='20px'>
                          <EventCard id={eventItem._id} date={eventItem.date} time={eventItem.time} title={eventItem.name} description={eventItem.description} imageUrl={eventItem?.thumbnail} />
                        </Box>
                      </>
                    )
                  })}
                </Box>
                <Box py='25px'>
                  <NavLink className='btn btn-primary' onClick={onOpenCreateEvent}>
                    <Flex alignItems='center'>
                      <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
                      <Text>Create Event</Text>
                    </Flex>
                  </NavLink>
                </Box>
              </Box>
            </TabPanel>

            {/* Participants/Members Tab */}
            <TabPanel h='100%' p='0'>
              <Box
                display={'flex'}
                flexDirection={'column'}
                height='100%'
              >
                <Box>
                  <Text ps='4' py='5px'>
                    {selectedChat?.users.length} members
                  </Text>
                </Box>
                <Box
                  h='50%'
                  overflow='auto'
                  flex='1'
                  p='4'
                >
                  <Accordion allowToggle>
                    {selectedChat?.users.map(u =>
                      <ChatOnline
                        stream={stream}
                        key={u._id}
                        user1={u}
                        handleFunction={() => handleRemove(u)} />
                    )}

                  </Accordion>
                </Box>
                <Box py='25px' textAlign='center'>
                  <NavLink onClick={onAddOpen} className='btn btn-primary'>
                    <Flex alignItems='center'>
                      <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
                      <Text>Add Member</Text>
                    </Flex>
                  </NavLink>
                </Box>
              </Box>

              {/* Create Event Modal */}
              <EventModal type={"Create"} createEventLoading={createEventLoading} isOpenCreateEvent={isOpenCreateEvent} onCloseCreateEvent={onCloseCreateEvent} name={name} setEventName={setEventName} description={description} setDescription={setDescription} date={date} setDate={setDate} time={time} setTime={setTime} selectedImage={selectedImage} imageChange={imageChange} handleSubmit={handleCreateEvent} fileInputRef={fileInputRef} />

              {/* Add Member Modal */}
              <Modal size={['xs', 'xs', 'xl', 'lg']} isOpen={isAddOpen} onClose={onAddClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Add Member</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody maxHeight={'lg'} overflow={'scroll'} overflowX={'hidden'}>
                    <Input
                      value={search}
                      placeholder="Search Member" onChange={handleSearch}
                      focusBorderColor='#9F85F7'
                    />
                    {loading
                      ?
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        my={2}
                        maxHeight={fullScreen ? '48' : '8'}
                        overflowY={'scroll'}
                      >
                        <Spinner
                          thickness='4px'
                          speed='0.6s'
                          emptyColor='gray.200'
                          color='buttonPrimaryColor'
                          size='xl'
                        />
                      </Box>
                      :
                      <Box maxHeight={fullScreen ? '48' : '8'}
                        overflowY={'scroll'}>
                        {search.length > 0 &&
                          searchResults?.map(user => (
                            <Box
                              my={'2'}
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
                              onClick={
                                () => handleAddUser(user._id)
                              }
                            >
                              <UserListItem user={user} />
                            </Box>
                          ))}
                      </Box>
                    }
                  </ModalBody>

                  <ModalFooter>
                    <Button backgroundColor={'buttonPrimaryColor'} color={'white'} mr={3} onClick={onAddClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </TabPanel>


            {/* Settings Tab */}
            <TabPanel>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'flex-end'}
                minHeight={fullScreen ? '100%' : '20vh'}
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
                  <Box display={'flex'} flexDirection={'column'} mx={'2'} mb={fullScreen ? '36' : '2'}>
                    <Input
                      mr={'2'}
                      value={groupChatName}
                      placeholder={selectedChat?.chatName}
                      _placeholder={{ color: 'inherit' }}
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button size={fullScreen ? 'md' : 'sm'} mt={'4'} color={'white'} backgroundColor={'buttonPrimaryColor'} onClick={handleRename}>
                      Rename
                    </Button>
                  </Box>
                }

                <Box my={'2'}>

                  <Button size={fullScreen ? 'md' : 'sm'} onClick={onAddOpen} rightIcon={<GrUserAdd />} color={'buttonPrimaryColor'} variant='outline'>
                    Add Member
                  </Button>

                  {/* Confirm Add Member */}
                  <EndLeaveModal
                    leastDestructiveRef={cancelRef}
                    onClose={onConfirmClose}
                    header={'Leave Group'}
                    body={'Are you sure you want to leave this group?'}
                    confirmButton={'Leave'}
                    confirmFunction={() => {
                      handleRemove(user);
                      onConfirmClose();
                    }}
                    isOpen={isConfirmOpen}
                  />

                </Box>

                <Box my={fullScreen ? '2' : '0'}>
                  <Button size={fullScreen ? 'md' : 'sm'} onClick={onConfirmOpen} rightIcon={<HiUserRemove />} colorScheme='red' variant='outline'>
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

const Members = ({ fetchAgain, setFetchAgain, token, meetingId, admin }) => {

  return (
    // <Box
    //   height={'85vh'}
    //   width={'98%'}
    //   bg={'whiteColor'}
    //   p={'1.5'}
    //   my={'5'}
    //   mr={'10'}
    //   borderRadius={'xl'}
    //   display={['none', 'none', 'none', 'block']}
    //   boxShadow={'dark-lg'}>
    <Box
      bg={'whiteColor'}
      display={['none', 'none', 'none', 'block']}
      borderLeft='1px solid #EAE4FF'
      h='100%'
    >

      <MembersComponent admin={admin} token={token} meetingId={meetingId} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

    </Box>
  )
}

export default Members

