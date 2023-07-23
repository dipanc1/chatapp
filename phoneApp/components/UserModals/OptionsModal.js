import { Box, Button, Icon, IconButton, Popover, Text } from 'native-base';
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AddModal from './AddModal';
import EventModal from './EventModal'
import axios from 'axios';
import { backend_url } from '../../production';


const OptionsModal = ({ group, deleteEvent, eventId, user, fetchAgain, setFetchAgain, chat, admin, eventDetails }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [showModalEvent, setShowModalEvent] = React.useState(false);
  const [eventType, setEventType] = React.useState('');
  const [eventName, setEventName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [createEventLoading, setCreateEventLoading] = React.useState(false);

  const [editEventName, setEditEventName] = React.useState(eventDetails?.name);
  const [editDescription, setEditDescription] = React.useState(eventDetails?.description);
  const [editDate, setEditDate] = React.useState(eventDetails?.date.split('T')[0]);
  const [editTime, setEditTime] = React.useState(eventDetails?.time)
  const [editSelectedImage, setEditSelectedImage] = React.useState(eventDetails?.thumbnail);
  const [editEventLoading, setEditEventLoading] = React.useState(false);

  const handleAddEvent = async () => {
    setCreateEventLoading(true)

    if (!admin) {
      setCreateEventLoading(false)
      // toast({
      //   title: "You are not the admin of this group",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
      alert('You are not the admin of this group')
      setEventName("");
      setDescription("");
      setDate("");
      setTime("");
      setSelectedImage(null);
      return;
    }

    if (eventName === "" || description === "" || date === "" || time === "") {
      setCreateEventLoading(false)
      // toast({
      //   title: "Please fill all the fields",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
      alert('Please fill all the fields')
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };


    if (selectedImage === null) {
      await axios.put(`${backend_url}/conversation/event/${chat._id}`, {
        name: eventName,
        description,
        date,
        time,
      }, config)
        .then(async (res) => {
          await axios.get(`${backend_url}/conversation/event/${chat._id}`, config).then((res) => {
            // toast({
            //   title: "Event Created!",
            //   description: "Event created successfully",
            //   status: "success",
            //   duration: 5000,
            //   isClosable: true,
            //   position: "bottom-left",
            // });
            chat.events = res.data;
            setCreateEventLoading(false);
            setEventName("");
            setDescription("");
            setDate("");
            setTime("");
            setSelectedImage(null);
            setShowModalEvent(false);
            setFetchAgain(!fetchAgain);
          }).catch((err) => {
            console.log(err);
            // toast({
            //   title: "Error Occured!",
            //   description: "Something went wrong",
            //   status: "error",
            //   duration: 5000,
            //   isClosable: true,
            //   position: "bottom-left",
            // });
            setCreateEventLoading(false);
            setEventName("");
            setDescription("");
            setDate("");
            setTime("");
            setSelectedImage(null);
            setShowModalEvent(false);
          })
        })
        .catch((err) => {
          console.log(err);
          // toast({
          //   title: "Error Occured!",
          //   description: "Something went wrong",
          //   status: "error",
          //   duration: 5000,
          //   isClosable: true,
          //   position: "bottom-left",
          // });
          setShowModalEvent(false);
          setCreateEventLoading(false);
          setEventName("");
          setDescription("");
          setDate("");
          setTime("");
          setSelectedImage(null);
        });
    } else {
      await axios.put(`${backend_url}/conversation/event/${chat._id}`, {
        name: eventName,
        description,
        date,
        time,
        thumbnail: selectedImage
      }, config)
        .then(async (res) => {
          await axios.get(`${backend_url}/conversation/event/${chat._id}`, config).then((res) => {
            // toast({
            //   title: "Event Created!",
            //   description: "Event created successfully",
            //   status: "success",
            //   duration: 5000,
            //   isClosable: true,
            //   position: "bottom-left",
            // });
            console.log(res.data);
            setCreateEventLoading(false);
            setEventName("");
            setDescription("");
            setDate("");
            setTime("");
            setSelectedImage(null);
            setShowModalEvent(false);
          }).catch((err) => {
            console.log(err);
            // toast({
            //   title: "Error Occured!",
            //   description: "Something went wrong",
            //   status: "error",
            //   duration: 5000,
            //   isClosable: true,
            //   position: "bottom-left",
            // });
            setCreateEventLoading(false);
            setEventName("");
            setDescription("");
            setDate("");
            setTime("");
            setSelectedImage(null);
            setShowModalEvent(false);
          })
        })
        .catch((err) => {
          console.log(err);
          // toast({
          //   title: "Error Occured!",
          //   description: "Something went wrong",
          //   status: "error",
          //   duration: 5000,
          //   isClosable: true,
          //   position: "bottom-left",
          // });
          setShowModalEvent(false);
          setCreateEventLoading(false);
          setEventName("");
          setDescription("");
          setDate("");
          setTime("");
          setSelectedImage(null);
        });
    }
  }

  const handleEditEvent = async () => {
    setEditEventLoading(true)

    if (!admin) {
      setEditEventLoading(false)
      // toast({
      //   title: "You are not the admin of this group",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
      setEditEventName(eventDetails?.name);
      setEditDescription(eventDetails?.description);
      setEditDate(eventDetails?.date.split('T')[0]);
      setEditTime(eventDetails?.time);
      setEditSelectedImage(editSelectedImage);
      return;
    }


    if (editEventName === "" || editDescription === "" || editDate === "" || editTime === "") {
      setEditEventLoading(false)
      // toast({
      //   title: "Please fill all the fields",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    if (editSelectedImage === null) {
      await axios.put(`${backend_url}/conversation/event/edit/${eventId}`, {
        name: editEventName,
        description: editDescription,
        date: editDate,
        time: editTime,
        chatId: chat._id,
      }, config)
        .then(async (res) => {
          await axios.get(`${backend_url}/conversation/event/${chat._id}`, config).then((res) => {
            chat.events = res.data;
            // toast({
            //   title: "Event Created!",
            //   description: "Event created successfully",
            //   status: "success",
            //   duration: 5000,
            //   isClosable: true,
            //   position: "bottom-left",
            // });
            setEditEventName(eventDetails?.name);
            setEditDescription(eventDetails?.description);
            setEditDate(eventDetails?.date.split('T')[0]);
            setEditTime(eventDetails?.time);
            setEditSelectedImage(null);
            setShowModalEvent(false);
            setFetchAgain(!fetchAgain);
          }).catch((err) => {
            console.log(err, "error");
            // toast({
            //   title: "Error Occured!",
            //   description: "Something went wrong",
            //   status: "error",
            //   duration: 5000,
            //   isClosable: true,
            //   position: "bottom-left",
            // });
            setEditEventName(eventDetails?.name);
            setEditDescription(eventDetails?.description);
            setEditDate(eventDetails?.date.split('T')[0]);
            setEditTime(eventDetails?.time);
            setEditSelectedImage(null);
            setShowModalEvent(false);
          })
        })
        .catch((err) => {
          console.log(err, "error2");
          // toast({
          //   title: "Error Occured!",
          //   description: "Something went wrong",
          //   status: "error",
          //   duration: 5000,
          //   isClosable: true,
          //   position: "bottom-left",
          // });
          setShowModalEvent(false);
          setEditEventName(eventDetails?.name);
          setEditDescription(eventDetails?.description);
          setEditDate(eventDetails?.date.split('T')[0]);
          setEditTime(eventDetails?.time);
          setEditSelectedImage(null);
        });
    } else {
      await axios.put(`${backend_url}/conversation/event/edit/${eventId}`, {
        name: editEventName,
        description: editDescription,
        date: editDate,
        time: editTime,
        thumbnail: editSelectedImage,
        chatId: chat._id,
      }, config)
        .then(async (res) => {
          await axios.get(`${backend_url}/conversation/event/${chat._id}`, config).then((res) => {
            // toast({
            //   title: "Event Created!",
            //   description: "Event created successfully",
            //   status: "success",
            //   duration: 5000,
            //   isClosable: true,
            //   position: "bottom-left",
            // });
            chat.events = res.data;
            setEditEventName(eventDetails?.name);
            setEditDescription(eventDetails?.description);
            setEditDate(eventDetails?.date.split('T')[0]);
            setEditTime(eventDetails?.time);
            setEditSelectedImage(editSelectedImage);
            setShowModalEvent(false);
            setFetchAgain(!fetchAgain);
          }).catch((err) => {
            console.log(err, "error");
            // toast({
            //   title: "Error Occured!",
            //   description: "Something went wrong",
            //   status: "error",
            //   duration: 5000,
            //   isClosable: true,
            //   position: "bottom-left",
            // });
            setEditEventName(eventDetails?.name);
            setEditDescription(eventDetails?.description);
            setEditDate(eventDetails?.date.split('T')[0]);
            setEditTime(eventDetails?.time);
            setEditSelectedImage(editSelectedImage);
            setShowModalEvent(false);
          })
        })
        .catch((err) => {
          console.log(err, "error2");
          // toast({
          //   title: "Error Occured!",
          //   description: "Something went wrong",
          //   status: "error",
          //   duration: 5000,
          //   isClosable: true,
          //   position: "bottom-left",
          // });
          setShowModalEvent(false);
          setEditEventName(eventDetails?.name);
          setEditDescription(eventDetails?.description);
          setEditDate(eventDetails?.date.split('T')[0]);
          setEditTime(eventDetails?.time);
          setEditSelectedImage(editSelectedImage);
        });
    }
  }


  return (
    <Box alignItems="center">
      <Popover trigger={triggerProps => {
        return <IconButton {...triggerProps} icon={<MaterialIcons name="more-vert" size={40} />} />
      }}>
        <Popover.Content>
          <Popover.Body>
            <Button.Group space={1} display={'flex'} flexDirection={'column'}>
              {
                group ?
                  <>
                    <Button
                      onPress={
                        () => setShowModal(true)
                      }
                      leftIcon={<Icon size={'lg'} as={<MaterialIcons name="group-add" size={40} />} />} colorScheme="coolGray" variant="ghost">
                      <Text fontSize={'md'}>Add Members</Text>
                    </Button>
                    <Button
                      onPress={
                        () => {
                          setEventType('Create')
                          setShowModalEvent(true)
                        }
                      }
                      leftIcon={<Icon size={'lg'} as={<MaterialIcons name="event" size={40} />} />} colorScheme="coolGray" variant="ghost">
                      <Text fontSize={'md'}>Create Event</Text>
                    </Button>
                  </>
                  :
                  <>
                    <Button onPress={
                      () => {
                        setEventType('Edit')
                        setShowModalEvent(true)
                      }
                    } leftIcon={<Icon size={'lg'} as={<MaterialIcons name="edit" size={40} />} />} colorScheme="coolGray" variant="ghost">
                      <Text fontSize={'md'}>Edit</Text>
                    </Button>
                    <Button onPress={() => deleteEvent(eventId)} leftIcon={<Icon size={'lg'} color={'red.400'} as={<MaterialIcons name="delete" size={40} />} />} variant={'ghost'}>
                      <Text color={'red.400'} fontSize={'md'}>Delete</Text>
                    </Button>
                  </>
              }

            </Button.Group>
          </Popover.Body>
        </Popover.Content>
      </Popover>

      <AddModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showModal={showModal} setShowModal={setShowModal} chat={chat} />

      {eventType === "Edit"
        ?
        <EventModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showModal={showModalEvent} setShowModal={setShowModalEvent} eventType={eventType} setEventType={setEventType} eventName={editEventName} setEventName={setEditEventName} description={editDescription} setDescription={setEditDescription} date={editDate} setDate={setEditDate} time={editTime} setTime={setEditTime} selectedImage={editSelectedImage} setSelectedImage={setEditSelectedImage} createEventLoading={editEventLoading} setCreateEventLoading={setEditEventLoading} handleSubmit={handleEditEvent} />
        :
        <EventModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showModal={showModalEvent} setShowModal={setShowModalEvent} eventType={eventType} setEventType={setEventType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} date={date} setDate={setDate} time={time} setTime={setTime} selectedImage={selectedImage} setSelectedImage={setSelectedImage} createEventLoading={createEventLoading} setCreateEventLoading={setCreateEventLoading} handleSubmit={handleAddEvent} />}


    </Box>
  )
}

export default OptionsModal