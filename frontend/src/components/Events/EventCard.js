import React, {
  useContext,
  useState
} from 'react'
import { NavLink } from "react-router-dom";
import {
  GridItem,
  Image,
  Flex,
  Text,
  Button,
  Box,
  UnorderedList,
  ListItem,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { AppContext } from '../../context/AppContext';
import { backend_url, pictureUpload } from '../../baseApi';
import axios from 'axios';
import EventModal from '../UserModals/EventModal';
import StreamModalPeer from '../UserModals/StreamModalPeer';

const EventCard = ({
  index,
  id,
  title,
  date,
  time,
  imageUrl,
  description,
  admin,
  chatId,
  selectEvent,
  fetchAgain,
  setFetchAgain
}) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { selectedChat } = useContext(AppContext);

  const [toggleEventMenu, setToggleEventMenu] = useState(false);
  const [name, setEventName] = useState(title);
  const [descriptiond, setDescriptiond] = useState(description);
  const [dated, setDated] = useState(date);
  const [timed, setTimed] = useState(time);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [editEventLoading, setEditEventLoading] = useState(false);
  const [meetingIdExists, setMeetingIdExists] = React.useState(false);

  const toast = useToast();

  const { isOpen: isOpenEditEvent, onOpen: onOpenEditEvent, onClose: onCloseEditEvent } = useDisclosure();

  const fileInputRef = React.createRef();

  React.useEffect(() => {
    if (selectedChat?.isGroupChat) {
      try {
        const checkStream = async () => {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          }
          const { data } = await axios.get(`${backend_url}/conversation/streaming/${selectedChat._id}`, config);
          if (data) {
            localStorage.setItem('roomId', data);
            setMeetingIdExists(true)
          } else {
            setMeetingIdExists(false);
          }
        }
        checkStream();
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Check Streaming Status",
          status: "error",
          isClosable: true,
          position: "top",
          duration: 5000,
        });
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png')) {
      setSelectedImage(e.target.files[0]);
    } else {
      alert('Please select a valid image file');
    }
  }

  const handleEditEvent = async (e) => {
    setEditEventLoading(true)
    e.preventDefault();

    if (selectedChat.groupAdmin._id !== user._id) {
      setEditEventLoading(false);
      toast({
        title: "You are not the admin of this group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    };

    if (name === "" || descriptiond === "" || dated === "" || timed === "") {
      setEditEventLoading(false);
      toast({
        title: "Feilds cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setEventName(title);
      setDescriptiond(description);
      setDated(date);
      setTimed(time);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    if (selectedImage === null) {
      await axios.put(`${backend_url}/conversation/event/edit/${id}`, {
        name: name,
        description: descriptiond,
        date: dated,
        time: timed,
        thumbnail: imageUrl,
        chatId: selectedChat._id
      }, config)
        .then(async (res) => {
          await axios.get(`${backend_url}/conversation/event/${selectedChat._id}`, config).then((res) => {
            selectedChat.events = res.data;
            toast({
              title: "Event Edited!",
              description: "Event edited successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
            setEditEventLoading(false);
            setEventName(name);
            setDescriptiond(descriptiond);
            setDated(dated);
            setTimed(timed);
            if (fetchAgain !== undefined) setFetchAgain(!fetchAgain);
            onCloseEditEvent();
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
            setEditEventLoading(false);
            setEventName(name);
            setDescriptiond(descriptiond);
            setDated(dated);
            setTimed(timed);
            onCloseEditEvent();
          })
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const formData = new FormData();
      formData.append('api_key', '835688546376544')
      formData.append('file', selectedImage);
      formData.append('upload_preset', 'chat-app');

      await axios.put(pictureUpload, formData)
        .then(async (res) => {
          await axios.put(`${backend_url}/conversation/event/edit/${id}`, {
            name: name,
            description: descriptiond,
            date: dated,
            time: timed,
            thumbnail: res.data.url,
            chatId: selectedChat._id
          }, config)
            .then(async (res) => {
              await axios.get(`${backend_url}/conversation/event/${selectedChat._id}`, config).then((res) => {
                selectedChat.events = res.data;
                toast({
                  title: "Event Created!",
                  description: "Event edited successfully",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom-left",
                });
                setEditEventLoading(false);
                setEventName(name);
                setDescriptiond(descriptiond);
                setDated(dated);
                setTimed(timed);
                if (fetchAgain !== undefined) setFetchAgain(!fetchAgain);
                onCloseEditEvent();
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
                setEditEventLoading(false);
                setEventName(name);
                setDescriptiond(descriptiond);
                setDated(dated);
                setTimed(timed);
                onCloseEditEvent();
              })
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }

  const deleteEvent = async (id) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "You are not the admin of this group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newEvents = selectedChat.events.filter((event) => event._id !== id);
    selectedChat.events = newEvents;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
    };

    try {
      await axios.delete(`${backend_url}/conversation/event/delete/${id}/${selectedChat._id}`, config).then((res) => {
        toast({
          title: "Event Deleted!",
          description: "Event deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        if (fetchAgain !== undefined) setFetchAgain(!fetchAgain);
      });
    } catch (error) {
      axios.get(`${backend_url}/conversation/event/${selectedChat._id}`, config).then((res) => {
        selectedChat.events = res.data;
      }).catch((err) => {
        console.log(err);
      });
      toast({
        title: "Error Occured!",
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }

  }

  return (
    <>
      <NavLink>
        <GridItem bg='#EAE4FF' w='100%' overflow='hidden' borderRadius='10px'>
          <Image onClick={() => selectEvent(chatId)} src={imageUrl} w='100%' height='220px' objectFit='cover' />
          <Flex alignItems='center' justifyContent='space-between' px='20px' py='10px'>
            <Box>
              <Text flex='1' fontSize='18px'>
                {title}
              </Text>
              <Text color='#999' pt='4px' fontSize='13px'>
                {time} AM
              </Text>
            </Box>
            {selectedChat?.isGroupChat && (admin || meetingIdExists) && (index === 0) &&
              <Box>
                <StreamModalPeer admin={admin} title={title} date={date} time={time} imageUrl={imageUrl} description={description} />
              </Box>
            }
            <Box position='relative' zIndex='1'>
              <Button type='button' onClick={() => setToggleEventMenu(!toggleEventMenu)} bg='transparent'>
                <Image height='22px' src='https://ik.imagekit.io/sahildhingra/3dot-menu.png' />
              </Button>
              {
                toggleEventMenu && (
                  <Box overflow='hidden' className='lightHover' width='fit-content' position='absolute' borderRadius='10px' boxShadow='md' background='#fff' right='0' bottom='100%'>
                    <UnorderedList listStyleType='none' ms='0'>
                      <ListItem onClick={() => {
                        setToggleEventMenu(!toggleEventMenu);
                        onOpenEditEvent();
                      }} p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/draw.png" />
                        <Text>Edit</Text>
                      </ListItem>
                      <ListItem onClick={() => {
                        deleteEvent(id);
                        setToggleEventMenu(!toggleEventMenu);
                      }} p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/trash.png" />
                        <Text color='#FF0000'>Delete</Text>
                      </ListItem>
                    </UnorderedList>
                  </Box>
                )
              }
            </Box>
          </Flex>
        </GridItem>
      </NavLink>
      <EventModal type={"Update"} createEventLoading={editEventLoading} isOpenCreateEvent={isOpenEditEvent} onCloseCreateEvent={onCloseEditEvent} name={name} setEventName={setEventName} description={descriptiond} setDescription={setDescriptiond} date={dated} setDate={setDated} time={timed} setTime={setTimed} selectedImage={selectedImage} imageChange={imageChange} handleSubmit={handleEditEvent} fileInputRef={fileInputRef} imageUrl={imageUrl} />
    </>
  )
}

export default EventCard;