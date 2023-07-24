import React, { useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EventsCard from '../components/Events/EventsCard';
import { backend_url } from '../production';
import axios from 'axios';
import { PhoneAppContext } from '../context/PhoneAppContext';
import TabNavigatorStyled from '../components/Miscellaneous/TabNavigatorStyled';

const Tab = createMaterialTopTabNavigator();
let eventsTab = true;

const Events = ({ user, navigation }) => {
    const { dispatch, userInfo } = React.useContext(PhoneAppContext);
    const [chatId, setChatId] = useState();
    const [chatName, setChatName] = useState("");
    const [showModal, setShowModal] = React.useState(false);
    const [fetchAgain, setFetchAgain] = useState(false);

    const [eventsList, setEventsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    const [upcomingEventsList, setUpcomingEventsList] = useState([]);
    const [loadingUpcoming, setLoadingUpcoming] = useState(false);
    const [totalUpcomingCount, setTotalUpcomingCount] = useState(0);
    const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);
    const [totalUpcomingPages, setTotalUpcomingPages] = useState(0);
    const [currentUpcomingCount, setCurrentUpcomingCount] = useState(0);
    const [hasNextUpcomingPage, setHasNextUpcomingPage] = useState(false);
    const [hasPrevUpcomingPage, setHasPrevUpcomingPage] = useState(false);

    const [pastEventsList, setPastEventsList] = useState([]);
    const [loadingPast, setLoadingPast] = useState(false);
    const [totalPastCount, setTotalPastCount] = useState(0);
    const [currentPastPage, setCurrentPastPage] = useState(1);
    const [totalPastPages, setTotalPastPages] = useState(0);
    const [currentPastCount, setCurrentPastCount] = useState(0);
    const [hasNextPastPage, setHasNextPastPage] = useState(false);
    const [hasPrevPastPage, setHasPrevPastPage] = useState(false);

    React.useEffect(() => {
        const fetchAllEvents = async () => {
            setLoading(true);
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
                setEventsList(data.events);
                setTotalCount(data.totalCount);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setCurrentCount(data.currentCount);
                setHasNextPage(data.hasNextPage);
                setHasPrevPage(data.hasPrevPage);
                setLoading(false);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Events",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
                setLoading(false);
            }
        };

        const fetchAllUpcomingEvents = async () => {
            setLoadingUpcoming(true);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(
                    `${backend_url}/conversation/event/upcoming/1`,
                    config
                );
                setUpcomingEventsList(data.events);
                setTotalUpcomingCount(data.totalCount);
                setCurrentUpcomingPage(data.currentPage);
                setTotalUpcomingPages(data.totalPages);
                setCurrentUpcomingCount(data.currentCount);
                setHasNextUpcomingPage(data.hasNextPage);
                setHasPrevUpcomingPage(data.hasPrevPage);
                setLoadingUpcoming(false);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Events",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
                setLoadingUpcoming(false);
            }
        };

        const fetchAllPastEvents = async () => {
            setLoadingPast(true);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(
                    `${backend_url}/conversation/event/past/1`,
                    config
                );
                setPastEventsList(data.events);
                setTotalPastCount(data.totalCount);
                setCurrentPastPage(data.currentPage);
                setTotalPastPages(data.totalPages);
                setCurrentPastCount(data.currentCount);
                setHasNextPastPage(data.hasNextPage);
                setHasPrevPastPage(data.hasPrevPage);
                setLoadingPast(false);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Events",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
                setLoadingPast(false);
            }
        };

        fetchAllEvents();
        fetchAllUpcomingEvents();
        fetchAllPastEvents();
    }, [user.token]);

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
                setShowModal(true)
            } else {
                dispatch({ type: "SET_SELECTED_CHAT", payload: data });
                navigation.navigate(`Live Stream`, {
                    params: {
                        screen: `Groups`,
                        params: {
                            screen: `Chat`
                        }
                    }
                });
            }

        } catch (error) {
            console.log(error)
            // toast({
            //     title: "Error Occured!",
            //     description: "Failed to Load the Events",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom-left",
            // });
        }
    };

    const fetchMoreEvents = async (page) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${backend_url}/conversation/event/all/${page}`,
                config
            );
            setEventsList(data.events);
            setTotalCount(data.totalCount);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            setCurrentCount(data.currentCount);
            setHasNextPage(data.hasNextPage);
            setHasPrevPage(data.hasPrevPage);
            setLoading(false);
        } catch (error) {
            // toast({
            //     title: "Error Occured!",
            //     description: "Failed to Load the Events",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom-left",
            // });
            setLoading(false);
        }
    }

    const fetchAllUpcomingEvents = async (page) => {
        setLoadingUpcoming(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${backend_url}/conversation/event/upcoming/${page}`,
                config
            );
            setUpcomingEventsList(data.events);
            setTotalUpcomingCount(data.totalCount);
            setCurrentUpcomingPage(data.currentPage);
            setTotalUpcomingPages(data.totalPages);
            setCurrentUpcomingCount(data.currentCount);
            setHasNextUpcomingPage(data.hasNextPage);
            setHasPrevUpcomingPage(data.hasPrevPage);
            setLoadingUpcoming(false);
        } catch (error) {
            // toast({
            //     title: "Error Occured!",
            //     description: "Failed to Load the Events",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom-left",
            // });
            setLoadingUpcoming(false);
        }
    };

    const fetchAllPastEvents = async (page) => {
        setLoadingPast(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${backend_url}/conversation/event/past/${page}`,
                config
            );
            setPastEventsList(data.events);
            setTotalPastCount(data.totalCount);
            setCurrentPastPage(data.currentPage);
            setTotalPastPages(data.totalPages);
            setCurrentPastCount(data.currentCount);
            setHasNextPastPage(data.hasNextPage);
            setHasPrevPastPage(data.hasPrevPage);
            setLoadingPast(false);
        } catch (error) {
            // toast({
            //     title: "Error Occured!",
            //     description: "Failed to Load the Events",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom-left",
            // });
            setLoadingPast(false);
        }
    };

    return (
        <TabNavigatorStyled>
            <Tab.Screen name="Group Events">
                {props => <EventsCard {...props} loading={loading} user={user} data={eventsList} screen={eventsTab} selectEvent={selectEvent} chatName={chatName} showModal={setShowModal} chatId={chatId} paginateFunction={fetchMoreEvents} currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} currentCount={currentCount} hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />}
            </Tab.Screen>
            <Tab.Screen name="Upcoming Events">
                {props => <EventsCard {...props} loading={loadingUpcoming} user={user} data={upcomingEventsList} screen={eventsTab} selectEvent={selectEvent} chatName={chatName} showModal={setShowModal} chatId={chatId} paginateFunction={fetchAllUpcomingEvents} currentPage={currentUpcomingPage} totalPages={totalUpcomingPages} totalCount={totalUpcomingCount} currentCount={currentUpcomingCount} hasNextPage={hasNextUpcomingPage} hasPrevPage={hasPrevUpcomingPage} />}
            </Tab.Screen>
            <Tab.Screen name="Previous Events">
                {props => <EventsCard {...props} loading={loadingPast} user={user} data={pastEventsList} screen={eventsTab} selectEvent={selectEvent} chatName={chatName} showModal={showModal} setShowModal={setShowModal} chatId={chatId} paginateFunction={fetchAllPastEvents} currentPage={currentPastPage} totalPages={totalPastPages} totalCount={totalPastCount} currentCount={currentPastCount} hasNextPage={hasNextPastPage} hasPrevPage={hasPrevPastPage} />}
            </Tab.Screen>
        </TabNavigatorStyled>

    )
}

export default Events