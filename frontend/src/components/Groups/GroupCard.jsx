import { Box, Flex, Image, ListItem, Text, UnorderedList, useColorMode, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import GroupSettingsModal from '../UserModals/GroupSettingsModal';
import axios from 'axios';
import { api_key, pictureUpload, folder, backend_url } from '../../utils';
import AddMembersModal from '../UserModals/AddMembersModal';
import { AppContext } from '../../context/AppContext';
import EventModal from '../UserModals/EventModal';
import conversationApi from '../../services/apis/conversationApi';
import authApi from '../../services/apis/authApi';
import donationApi from '../../services/apis/donationApi';
import eventsApi from '../../services/apis/eventsApi';
import Cookies from "universal-cookie";

const GroupCard = ({
  chatId,
  name,
  members,
  upcomingEvents,
  isAdmin,
  fetchAgain,
  setFetchAgain,
  admin
}) => {
  const cookies = new Cookies();
  const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" });
  const [toggleGroupMenu, setToggleGroupMenu] = useState(false);
  const [groupChatName, setGroupChatName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [createEventLoading, setCreateEventLoading] = useState(false)
  const [targetAmount, setTargetAmount] = useState('');
  const [chatIdValue, setChatIdValue] = React.useState('');


  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isOpenCreateEvent, onOpen: onOpenCreateEvent, onClose: onCloseCreateEvent } = useDisclosure()

  const { colorMode } = useColorMode();

  const { userInfo, fullScreen, getCloudinarySignature, signature, timestamp } = React.useContext(AppContext);

  const toast = useToast();


  const fileInputRef = React.createRef();

  const imageChange = async (e) => {
    await getCloudinarySignature();
    if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png')) {
      setSelectedImage(e.target.files[0]);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid image",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  const handleCreateEvent = async (e) => {
    setCreateEventLoading(true)
    e.preventDefault();

    if (admin._id !== userInfo._id) {
      setCreateEventLoading(false)
      toast({
        title: "You are not the admin of this group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setEventName("");
      setDescription("");
      setDate("");
      setTargetAmount("");
      setTime("");
      setSelectedImage(null);
      return;
    }

    if (name === "" || description === "" || date === "" || time === "" || targetAmount === "") {
      setCreateEventLoading(false)
      toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };


    if (selectedImage === null) {
      await eventsApi.addEvent(chatId, {
        name,
        description,
        date,
        time
      }, config)
        .then(async (res) => {
          const eventId = res.data._id;
          const dontation = await donationApi.startDonation(
            {
              event: eventId,
              name,
              targetAmount
            }
            , config);
          if (dontation) {
            upcomingEvents = [...upcomingEvents, res.data]
            toast({
              title: "Event Created!",
              description: "Event created successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
            setCreateEventLoading(false);
            setEventName("");
            setDescription("");
            setTargetAmount("");
            setDate("");
            setTime("");
            setSelectedImage(null);
            onCloseCreateEvent();
            setFetchAgain(!fetchAgain);
          }
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
          setTargetAmount("");
          setDate("");
          setTime("");
          setSelectedImage(null);
          onCloseCreateEvent();
        });
    } else {
      const formData = new FormData();
      formData.append('api_key', api_key)
      formData.append('file', selectedImage);
      formData.append('folder', folder)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)

      await axios.post(pictureUpload, formData)
        .then(async (res) => {
          await eventsApi.addEvent(chatId, {
            name,
            description,
            date,
            time,
            thumbnail: res.data.secure_url
          }, config)
            .then(async (res) => {
              const eventId = res.data._id;
              const dontation = await donationApi.startDonation(
                {
                  event: eventId,
                  name,
                  targetAmount
                }
                , config);
              if (dontation) {
                upcomingEvents = [...upcomingEvents, res.data]
                toast({
                  title: "Event Created!",
                  description: "Event created successfully",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom-left",
                });
                setCreateEventLoading(false);
                setEventName("");
                setDescription("");
                setTargetAmount("");
                setDate("");
                setTime("");
                setSelectedImage(null);
                onCloseCreateEvent();
              }
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
              setTargetAmount("");
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
          setTargetAmount("");
          setEventName("");
          setDescription("");
          setDate("");
          setTime("");
          setSelectedImage(null);
          onCloseCreateEvent();
        });
    }

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
        chatId: chatId
      }
      await conversationApi.renameConversation(body, config)
      toast({
        title: "Group chat renamed",
        description: "Group chat renamed to " + groupChatName,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
      setGroupChatName('');
      onClose();
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
      const { data } = await authApi.searchUser(search, config);
      setSearchResults(data.users);
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

  const handleAddUser = async (user1) => {
    if (members.map(user => userInfo._id).includes(user1)) {
      return toast({
        title: "Error Occured!",
        description: "User already in group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    if (admin._id !== userInfo._id) {
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
      await conversationApi.addToGroup(
        {
          chatId: chatId,
          userId: user1,
        },
        config
      );
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

  const openMembersModal = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await conversationApi.getEncryptedChatUrl(chatId, config);
      onAddOpen();
      setChatIdValue(data.encryptedChatId);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Members",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }

  }


  return (
    <Box p='18px 29px' borderRadius='10px' border="0">
      <Flex justifyContent="space-between">
        <Flex>
          <Flex>
            <Text cursor={'default'} as="h2" color="#9F85F7" fontSize="26px" fontWeight="500">{name}</Text>
          </Flex>
          {
            isAdmin && (
              <Image ml='17px' h="32px" src="https://ik.imagekit.io/sahildhingra/crown-icon.png" />
            )
          }
        </Flex>
        {isAdmin &&
          <Box position='relative'>
            <Image onClick={() => setToggleGroupMenu(!toggleGroupMenu)} px='10px' cursor="pointer" h="32px" src="https://ik.imagekit.io/sahildhingra/3dot-menu.png" />
            {
              toggleGroupMenu && (
                <Box zIndex='1' overflow='hidden' className='lightHover' width='fit-content' position='absolute' borderRadius='10px' boxShadow='md' background='#fff' right='0' top='100%'>
                  <UnorderedList listStyleType='none' ms='0'>
                    <ListItem onClick={openMembersModal} cursor={"pointer"} whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/user.png" />
                      <Text color={colorMode === 'light' ? 'black' : "black"}>Add Member</Text>
                    </ListItem>
                    <ListItem cursor={"pointer"} onClick={onOpenCreateEvent} whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/events.png" />
                      <Text color={colorMode === 'light' ? 'black' : "black"}>Create Event</Text>
                    </ListItem>
                    <ListItem cursor={"pointer"} onClick={onOpen} p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/settings.png" />
                      <Text color={colorMode === 'light' ? 'black' : "black"}>Settings</Text>
                    </ListItem>
                  </UnorderedList>
                </Box>
              )
            }
          </Box>}

      </Flex>
      <Flex pt="60px" justifyContent="space-between">
        <Box>
          <Text color={colorMode === 'dark' ? '#805AD5' : "#032E2B"} fontWeight="600" as="h3">Members</Text>
          <Text color="#737373">{members.length}</Text>
        </Box>
        <Box textAlign="right">
          <Text color={colorMode === 'dark' ? '#805AD5' : "#032E2B"} fontWeight="600" as="h3">Upcoming Events</Text>
          <Text color="#737373">{upcomingEvents.find(event => event.chatId === chatId) ? upcomingEvents.find(event => event.chatId === chatId).name : 'No Upcoming Events Yet'} </Text>
        </Box>
      </Flex>
      <GroupSettingsModal
        isOpen={isOpen}
        onClose={onClose}
        chatName={name}
        groupChatName={groupChatName}
        setGroupChatName={setGroupChatName}
        handleRename={handleRename}
        renameLoading={renameLoading}
        groupsTab={true}
      />

      {/* Add Member Modal */}
      <AddMembersModal chatIdValue={`${backend_url}/join-group/${chatIdValue}`} isAddOpen={isAddOpen} onAddClose={onAddClose} handleSearch={handleSearch} search={search} searchResults={searchResults} loading={loading} handleAddUser={handleAddUser} fullScreen={fullScreen} />

      {/* Create Event Modal */}
      <EventModal type={"Create"} createEventLoading={createEventLoading} isOpenCreateEvent={isOpenCreateEvent} onCloseCreateEvent={onCloseCreateEvent} name={eventName} setEventName={setEventName} description={description} setDescription={setDescription} date={date} setDate={setDate} time={time} setTime={setTime} selectedImage={selectedImage} imageChange={imageChange} handleSubmit={handleCreateEvent} fileInputRef={fileInputRef} targetAmount={targetAmount} setTargetAmount={setTargetAmount} />
    </Box>
  )
}

export default GroupCard