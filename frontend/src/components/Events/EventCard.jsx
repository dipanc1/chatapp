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
  useToast,
  useColorMode
} from '@chakra-ui/react';
import { AppContext } from '../../context/AppContext';
import { api_key, pictureUpload, folder } from '../../utils';
import axios from 'axios';
import EventModal from '../UserModals/EventModal';
import StreamModalPeer from '../UserModals/StreamModalPeer';
import conversationApi from '../../services/apis/conversationApi';
import donationApi from '../../services/apis/donationApi';
import Cookies from "universal-cookie";

import eventsApi from '../../services/apis/eventsApi';

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
  setFetchAgain,
  eventsPage
}) => {
  const cookies = new Cookies();
  const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" });

  const { selectedChat, userInfo, getCloudinarySignature, signature, timestamp, dispatch, events } = useContext(AppContext);

  const [toggleEventMenu, setToggleEventMenu] = useState(false);
  const [name, setEventName] = useState(title);
  const [descriptiond, setDescriptiond] = useState(description);
  const [dated, setDated] = useState(date);
  const [timed, setTimed] = useState(time);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [editEventLoading, setEditEventLoading] = useState(false);
  const [targetAmount, setTargetAmount] = useState('');
  const [meetingIdExists, setMeetingIdExists] = React.useState(false);

  const toast = useToast();
  const { colorMode } = useColorMode();

  const { isOpen: isOpenEditEvent, onOpen: onOpenEditEvent, onClose: onCloseEditEvent } = useDisclosure();

  const fileInputRef = React.createRef();

  React.useEffect(() => {
    if (selectedChat?.isGroupChat) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      try {
        const checkStream = async () => {
          const { data } = await conversationApi.checkStream(selectedChat._id, config);
          if (data) {
            localStorage.setItem('roomId', data);
            setMeetingIdExists(true)
          } else {
            setMeetingIdExists(false);
          }
        }
        const getTargetAmount = async () => {
          const { data } = await donationApi.getDonationOfAnEvent(id, config);
          if (data.length > 0) {
            setTargetAmount(data[0].targetAmount);
          }
        }
        getTargetAmount();
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

  const handleEditEvent = async (e) => {
    setEditEventLoading(true)
    e.preventDefault();

    if (selectedChat.groupAdmin._id !== userInfo._id) {
      setEditEventLoading(false);
      toast({
        title: "You are not the admin of this group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    };

    if (name === "" || descriptiond === "" || dated === "" || timed === "" || targetAmount === "") {
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
      await eventsApi.editEvent(id, {
        name: name,
        description: descriptiond,
        date: dated,
        time: timed,
        thumbnail: imageUrl,
        chatId: selectedChat._id
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
            events.map((event) => {
              if (event._id === id) {
                event.name = name;
                event.description = descriptiond;
                event.date = dated;
                event.time = timed;
                event.thumbnail = res.data.secure_url;
                return event;
              } else {
                return event;
              }
            });
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
            dispatch({ type: 'SET_FETCH_GROUP_DONATIONS' });
            setTimed(timed);
            if (fetchAgain !== undefined) setFetchAgain(!fetchAgain);
            onCloseEditEvent();
          }
        })
        .catch((err) => {
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
          console.log(err);
        })
    } else {
      const formData = new FormData();
      formData.append('api_key', api_key)
      formData.append('file', selectedImage);
      formData.append('folder', folder)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)

      await axios.put(pictureUpload, formData)
        .then(async (res) => {
          await eventsApi.editEvent(id, {
            name: name,
            description: descriptiond,
            date: dated,
            time: timed,
            thumbnail: res.data.secure_url,
            chatId: selectedChat._id
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
                events.map((event) => {
                  if (event._id === id) {
                    event.name = name;
                    event.description = descriptiond;
                    event.date = dated;
                    event.time = timed;
                    event.thumbnail = res.data.secure_url;
                    return event;
                  } else {
                    return event;
                  }
                });
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
                dispatch({ type: 'SET_FETCH_GROUP_DONATIONS' });
                setTimed(timed);
                if (fetchAgain !== undefined) setFetchAgain(!fetchAgain);
                onCloseEditEvent();
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
              setEditEventLoading(false);
              setEventName(name);
              setDescriptiond(descriptiond);
              setDated(dated);
              setTimed(timed);
              onCloseEditEvent();
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
          setEditEventLoading(false);
          setEventName(name);
          setDescriptiond(descriptiond);
          setDated(dated);
          setTimed(timed);
          onCloseEditEvent();
        });
    }

  }

  const deleteEvent = async (id) => {
    if (selectedChat.groupAdmin._id !== userInfo._id) {
      toast({
        title: "You are not the admin of this group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newEvents = events.filter((event) => event._id !== id);
    dispatch({ type: 'SET_EVENTS', payload: newEvents });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
    };

    try {
      await eventsApi.deleteEvent(id, selectedChat._id, config).then((res) => {
        toast({
          title: "Event Deleted!",
          description: "Event deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        if (fetchAgain !== undefined) setFetchAgain(!fetchAgain);
        dispatch({ type: 'SET_FETCH_GROUP_DONATIONS' });
      });
    } catch (error) {
      await eventsApi.getEvents(selectedChat._id, config).then((res) => {
        dispatch({ type: 'SET_EVENTS', payload: res.data });
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
        <GridItem position='relative' bg='#EAE4FF' w='100%' overflow='hidden' borderRadius='10px'>
          <Box position='absolute' right='0' top='0' zIndex='1'>
            {(!eventsPage && admin) && <Button type='button' onClick={() => setToggleEventMenu(!toggleEventMenu)} bg='transparent'>
              <Image height='22px' src='https://ik.imagekit.io/sahildhingra/3dot-menu.png' />
            </Button>}
            {
              toggleEventMenu && (
                <Box overflow='hidden' className='lightHover' width='fit-content' position='absolute' borderRadius='10px' boxShadow='md' background='#fff' right='5px' top='calc(100% + 5px)'>
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
          <Image onClick={() => selectEvent(chatId)} src={imageUrl ?? "https://ik.imagekit.io/sahildhingra/default-no-image-wide.jpg"} w='100%' height='220px' objectFit='cover' />
          <Flex alignItems='center' justifyContent='space-between' px='10px' py='10px'>
            <Box>
              <Text flex='1' fontSize='18px' color={colorMode === 'light' ? 'black' : "#7B7A7A"}>
                {title}
              </Text>
              <Text color='#999' pt='4px' fontSize='13px'>
                {time} AM
              </Text>
            </Box>
            {selectedChat?.isGroupChat && (admin || meetingIdExists) && (index === 0) &&
              <Box>
                <StreamModalPeer admin={admin} id={id} title={title} date={date} time={time} imageUrl={imageUrl} description={description} />
              </Box>
            }
          </Flex>
        </GridItem>
      </NavLink>
      <EventModal type={"Update"} createEventLoading={editEventLoading} isOpenCreateEvent={isOpenEditEvent} onCloseCreateEvent={onCloseEditEvent} name={name} setEventName={setEventName} description={descriptiond} setDescription={setDescriptiond} date={dated} setDate={setDated} time={timed} setTime={setTimed} selectedImage={selectedImage} imageChange={imageChange} handleSubmit={handleEditEvent} fileInputRef={fileInputRef} imageUrl={imageUrl} targetAmount={targetAmount} setTargetAmount={setTargetAmount} />
    </>
  )
}

export default EventCard;