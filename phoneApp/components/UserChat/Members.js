import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Participants from '../Miscellaneous/Participants';
import Settings from '../Miscellaneous/Settings';
import Chatbox from './Chatbox';
import EventsCard from '../Events/EventsCard';
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { Box, Button, IconButton } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EventModal from '../UserModals/EventModal';
import axios from 'axios';
import { backend_url } from '../../production';

const Tab = createMaterialTopTabNavigator();

//TODO: Change color of the tab bar

let eventsTab = false;

const Members = ({ user, fetchAgain, setFetchAgain, admin }) => {
  const screenOptions = {
    headerShown: false,
    tabBarLabelStyle: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    tabBarActiveTintColor: '#9F85F7',
    tabBarInactiveTintColor: 'grey',
    tabBarScrollEnabled: true,
    tabBarItemStyle: {
      padding: 0,
      margin: 0,
      width: 150,
    },
    tabBarIndicatorStyle: {
      backgroundColor: '#9F85F7',
    },
  };

  const sceneContainerStyle = {
    backgroundColor: '#F5F7FB',
  };

  const { selectedChat } = React.useContext(PhoneAppContext)

  const [showModal, setShowModal] = React.useState(false);
  const [showModalEvent, setShowModalEvent] = React.useState(false);
  const [eventType, setEventType] = React.useState('');
  const [eventName, setEventName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [createEventLoading, setCreateEventLoading] = React.useState(false);

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
      setEventName("");
      setDescription("");
      setDate("");
      setTime("");
      setSelectedImage(null);
      return;
    }


    if (eventName === "" || description === "" || date === "" || time === "") {
      setCreateEventLoading(false)
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    await axios.put(`${backend_url}/conversation/event/${selectedChat._id}`, {
      name: eventName,
      description,
      date,
      time
    }, config)
      .then(async (res) => {
        await axios.get(`${backend_url}/conversation/event/${selectedChat._id}`, config).then((res) => {
          // toast({
          //   title: "Event Created!",
          //   description: "Event created successfully",
          //   status: "success",
          //   duration: 5000,
          //   isClosable: true,
          //   position: "bottom-left",
          // });
          setCreateEventLoading(false);
          setShowModalEvent(false);
          setEventName("");
          setDescription("");
          setDate("");
          setTime("");
          setSelectedImage(null);
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
        console.log(err, "err");
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

  return (
    <Tab.Navigator {...{ screenOptions, sceneContainerStyle }}>
      <Tab.Screen
        name="Chat"
      >
        {props => <Chatbox {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Members"
      >
        {props => <Participants {...props} user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Tab.Screen>
      <Tab.Screen
        name="Events"
      >
        {props => <>
          <EventsCard fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} {...props} user={user} data={selectedChat?.events} screen={eventsTab} />
          <Box position={'absolute'} bottom={'5'} right={'5'}>
            <Button leftIcon={<MaterialIcons name="add" size={24} color="white" />} onPress={() => {
              setEventType('Create');
              setShowModalEvent(true);
            }} colorScheme={'cyan'} size={'md'} variant={"solid"}>Create Event</Button>
          </Box>
          <EventModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showModal={showModalEvent} setShowModal={setShowModalEvent} eventType={eventType} setEventType={setEventType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} date={date} setDate={setDate} time={time} setTime={setTime} selectedImage={selectedImage} setSelectedImage={setSelectedImage} createEventLoading={createEventLoading} setCreateEventLoading={setCreateEventLoading} handleSubmit={handleAddEvent} />
        </>
        }
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
      >
        {props => <Settings {...props} user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default Members