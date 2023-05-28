import React, {
  useEffect,
  useState
} from 'react'
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Heading,
  Flex,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';

import Static from "../components/common/Static"
import EventCard from '../components/Events/EventCard';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { backend_url } from '../baseApi';
import axios from 'axios';
import JoinGroupModal from '../components/UserModals/JoinGroupModal';

function Events() {
  const [activeTab, setActiveTab] = useState(1);
  const [eventsList, setEventsList] = useState([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState([]);
  const [previousEventsList, setPreviousEventsList] = useState([]);
  const [chatId, setChatId] = useState();
  const [chatName, setChatName] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const { dispatch, userInfo } = useContext(AppContext);
  const { isOpen: isOpenJoinEvent, onOpen: onOpenJoinEvent, onClose: onCloseJoinEvent } = useDisclosure();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `${backend_url}/conversation/event/all/1`,
          config
        );
        setEventsList(data);
        setUpcomingEventsList(data.filter((event) => {
          const eventDate = new Date(`${event.date.slice(0, 10)}T${event.time}:00.000Z`);
          eventDate.setHours(eventDate.getHours() - 5.5);
          const currentDate = new Date();
          return eventDate > currentDate;
        }
        ));
        setPreviousEventsList(data.filter((event) => {
          const eventDate = new Date(`${event.date.slice(0, 10)}T${event.time}:00.000Z`);
          eventDate.setHours(eventDate.getHours() - 5.5);
          const currentDate = new Date();
          return eventDate < currentDate;
        }
        ));
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Events",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    fetchAllEvents();
  }, [toast, user.token, fetchAgain]);

  const selectEvent = async (chatId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${backend_url}/conversation/${chatId}`,
        config
      );
      setChatId(data._id);
      setChatName(data.chatName);

      if (!data.users.map((u) => u._id === userInfo._id).includes(true)) {
        onOpenJoinEvent();
      } else {
        dispatch({ type: "SET_SELECTED_CHAT", payload: data });
        navigate(`/video-chat`);
      }

    } catch (error) {
      // console.log(error)
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Events",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  return (
    <>
      <Static>
        <Flex pb={['10px', '30px']} alignItems='center' justifyContent='space-between'>
          <Heading as='h1' size='lg' fontWeight='500'>Events</Heading>
        </Flex>
        <Box pb='30px'>
          <ul className="tab-nav">
            <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
              Group Events
            </li>
            <li onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
              Upcoming Events
            </li>
            <li onClick={() => setActiveTab(3)} className={activeTab === 3 ? "active" : ""}>
              Previous Events
            </li>
          </ul>
        </Box>
        <div className="tab-content">
          <div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>
            <Grid mb={['30px', '70px']} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap='2rem' rowGap={['1.5rem', '3rem']}>
              {
                eventsList?.map((eventItem, index) => {
                  return (
                    <>
                      <EventCard key={eventItem._id} selectEvent={selectEvent} chatId={eventItem.chatId} index={index} id={eventItem._id} date={eventItem.date} time={eventItem.time} title={eventItem.name} description={eventItem.description} imageUrl={eventItem?.thumbnail} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    </>
                  )
                })
              }
            </Grid>

          </div>
          <div className={"tab-themes tab-content-item " + (activeTab === 2 ? "current" : "")}>
            <Grid mb={['30px', '70px']} templateColumns={['repeat(1, 1fr)' ,'repeat(3, 1fr)']} gap='2rem' rowGap={['1.5rem', '3rem']}>
              {upcomingEventsList?.map((eventItem, index) => {
                return (
                  <>
                    <EventCard key={eventItem._id} selectEvent={selectEvent} chatId={eventItem.chatId} index={index} id={eventItem._id} date={eventItem.date} time={eventItem.time} title={eventItem.name} description={eventItem.description} imageUrl={eventItem?.thumbnail} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                  </>
                )
              })}
            </Grid>
          </div>
          <div className={"tab-content-item " + (activeTab === 3 ? "current" : "")}>
            <Grid mb={['30px', '70px']} templateColumns={['repeat(1, 1fr)' ,'repeat(3, 1fr)']} gap='2rem' rowGap={['1.5rem', '3rem']}>
              {previousEventsList?.map((eventItem, index) => {
                return (
                  <>
                    <EventCard key={eventItem._id} selectEvent={selectEvent} chatId={eventItem.chatId} index={index} id={eventItem._id} date={eventItem.date} time={eventItem.time} title={eventItem.name} description={eventItem.description} imageUrl={eventItem?.thumbnail} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                  </>
                )
              })}
            </Grid>
          </div>
        </div>
      </Static>
      <JoinGroupModal chatName={chatName} isOpenJoinEvent={isOpenJoinEvent} onOpenJoinEvent={onOpenJoinEvent} onCloseJoinEvent={onCloseJoinEvent} chatId={chatId} />
    </>
  )
}

export default Events