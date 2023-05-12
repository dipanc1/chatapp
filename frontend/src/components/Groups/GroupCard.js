import { Box, Flex, Image, ListItem, Text, UnorderedList, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import GroupSettingsModal from '../UserModals/GroupSettingsModal';
import axios from 'axios';
import { backend_url, pictureUpload } from '../../baseApi';
import AddMembersModal from '../UserModals/AddMembersModal';
import { AppContext } from '../../context/AppContext';
import EventModal from '../UserModals/EventModal';

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
  const user = JSON.parse(localStorage.getItem('user'));
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


  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isOpenCreateEvent, onOpen: onOpenCreateEvent, onClose: onCloseCreateEvent } = useDisclosure()


  const { userInfo, fullScreen } = React.useContext(AppContext);

  const toast = useToast();

  
  const fileInputRef = React.createRef();

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

    if (admin._id !== user._id) {
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
      setTime("");
      setSelectedImage(null);
      return;
    }

    if (name === "" || description === "" || date === "" || time === "") {
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
      await axios.put(`${backend_url}/conversation/event/${chatId}`, {
        name,
        description,
        date,
        time
      }, config)
        .then(async (res) => {
          await axios.get(`${backend_url}/conversation/event/${chatId}`, config).then((res) => {
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
            setDate("");
            setTime("");
            setSelectedImage(null);
            onCloseCreateEvent();
            setFetchAgain(!fetchAgain);
          }).catch((err) => {
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
          })
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
        .then(async (res) => {
          await axios.put(`${backend_url}/conversation/event/${chatId}`, {
            name,
            description,
            date,
            time,
            thumbnail: res.data.url
          }, config)
            .then(async (res) => {
              await axios.get(`${backend_url}/conversation/event/${chatId}`, config).then((res) => {
                upcomingEvents = res.data;
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
                setDate("");
                setTime("");
                setSelectedImage(null);
                onCloseCreateEvent();
              }).catch((err) => {
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
              })
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
      await axios.put(`${backend_url}/conversation/rename`, body, config)
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

  const handleAddUser = async (user1) => {
    // console.warn("USER ID TO ADD", selectedChat.users.map(user => user._id).includes(user1));
    if (members.map(user => user._id).includes(user1)) {
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
      const { data } = await axios.put(
        `${backend_url}/conversation/groupadd`,
        {
          chatId: chatId,
          userId: user1,
        },
        config
      );
      console.log(data);
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
                    <ListItem onClick={onAddOpen} cursor={"pointer"} whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/user.png" />
                      <Text>Add Member</Text>
                    </ListItem>
                    <ListItem cursor={"pointer"} onClick={onOpenCreateEvent} whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/events.png" />
                      <Text>Create Event</Text>
                    </ListItem>
                    <ListItem cursor={"pointer"} onClick={onOpen} p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/settings.png" />
                      <Text>Settings</Text>
                    </ListItem>
                  </UnorderedList>
                </Box>
              )
            }
          </Box>}

      </Flex>
      <Flex pt="60px" justifyContent="space-between">
        <Box>
          <Text color="#032E2B" fontWeight="600" as="h3">Members</Text>
          <Text color="#737373">{members.length}</Text>
        </Box>
        <Box textAlign="right">
          <Text color="#032E2B" fontWeight="600" as="h3">Upcoming Events</Text>
          <Text color="#737373">{upcomingEvents.length}</Text>
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

      <AddMembersModal isAddOpen={isAddOpen} onAddClose={onAddClose} handleSearch={handleSearch} search={search} searchResults={searchResults} loading={loading} handleAddUser={handleAddUser} fullScreen={fullScreen} />

      {/* Create Event Modal */}
      <EventModal type={"Create"} createEventLoading={createEventLoading} isOpenCreateEvent={isOpenCreateEvent} onCloseCreateEvent={onCloseCreateEvent} name={eventName} setEventName={setEventName} description={description} setDescription={setDescription} date={date} setDate={setDate} time={time} setTime={setTime} selectedImage={selectedImage} imageChange={imageChange} handleSubmit={handleCreateEvent} fileInputRef={fileInputRef} />
    </Box>
  )
}

export default GroupCard