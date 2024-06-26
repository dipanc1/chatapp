import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Heading,
    Flex,
    useToast,
    useDisclosure,
    Spinner,
} from '@chakra-ui/react';

import Static from '../components/common/Static';
import EventCard from '../components/Events/EventCard';
import { useContext } from 'react';
import Cookies from 'universal-cookie';
import { AppContext } from '../context/AppContext';
import JoinGroupModal from '../components/UserModals/JoinGroupModal';
import Pagination from '../components/Miscellaneous/Pagination';
import conversationApi from '../services/apis/conversationApi';
import { ONE } from '../constants';
import eventsApi from '../services/apis/eventsApi';
import NothingToShowMessage from '../components/Miscellaneous/NothingToShowMessage';

function Events() {
    const [activeTab, setActiveTab] = useState(1);
    const [chatId, setChatId] = useState();
    const [chatName, setChatName] = useState('');
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

    const toast = useToast();
    const navigate = useNavigate();

    const { dispatch, userInfo } = useContext(AppContext);
    const {
        isOpen: isOpenJoinEvent,
        onOpen: onOpenJoinEvent,
        onClose: onCloseJoinEvent,
    } = useDisclosure();

    const cookies = new Cookies();
    const user =
        JSON.parse(localStorage.getItem('user')) ||
        cookies.get(
            'auth_token',
            { domain: '.fundsdome.com' || 'localhost' },
            { path: '/' },
        );

    useEffect(() => {
        const fetchAllEvents = async () => {
            setLoading(true);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await eventsApi.getAllEvents(ONE, config);
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
                    title: 'Error Occured!',
                    description: 'Failed to Load the Events',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left',
                });
                setLoading(false);
            }
        };

        const fetchAllUpcomingEvents = async () => {
            setLoadingUpcoming(true);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await eventsApi.getUpcomingEvents(ONE, config);
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
                    title: 'Error Occured!',
                    description: 'Failed to Load the Events',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left',
                });
                setLoadingUpcoming(false);
            }
        };

        const fetchAllPastEvents = async () => {
            setLoadingPast(true);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await eventsApi.getPastEvents(ONE, config);

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
                    title: 'Error Occured!',
                    description: 'Failed to Load the Events',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left',
                });
                setLoadingPast(false);
            }
        };

        switch (activeTab) {
            case 1:
                fetchAllEvents();
                break;
            case 2:
                fetchAllUpcomingEvents();
                break;
            default:
                fetchAllPastEvents();
                break;
        }
    }, [toast, user.token, fetchAgain, activeTab]);

    const selectEvent = async (chatId) => {
        activeTab === 1
            ? setLoading(true)
            : activeTab === 2
                ? setLoadingUpcoming(true)
                : setLoadingPast(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await conversationApi.getChatWithId(
                chatId,
                config,
            );
            setChatId(data._id);
            setChatName(data.chatName);

            if (!data.users.map((u) => u._id === userInfo._id).includes(true)) {
                activeTab === 1
                    ? setLoading(false)
                    : activeTab === 2
                        ? setLoadingUpcoming(false)
                        : setLoadingPast(false);
                onOpenJoinEvent();
            } else {
                activeTab === 1
                    ? setLoading(false)
                    : activeTab === 2
                        ? setLoadingUpcoming(false)
                        : setLoadingPast(false);
                dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
                navigate(`/video-chat`);
            }
        } catch (error) {
            // console.log(error)
            activeTab === 1
                ? setLoading(false)
                : activeTab === 2
                    ? setLoadingUpcoming(false)
                    : setLoadingPast(false);
            toast({
                title: 'Error Occured!',
                description: 'Failed to Load the Events',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    const fetchMoreEvents = async (page) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await eventsApi.getAllEvents(page, config);

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
                title: 'Error Occured!',
                description: 'Failed to Load the Events',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoading(false);
        }
    };

    const fetchAllUpcomingEvents = async (page) => {
        setLoadingUpcoming(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await conversationApi.getUpcomingEvents(
                page,
                config,
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
                title: 'Error Occured!',
                description: 'Failed to Load the Events',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoadingUpcoming(false);
        }
    };

    const fetchAllPastEvents = async (page) => {
        setLoadingPast(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await eventsApi.getPastEvents(page, config);
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
                title: 'Error Occured!',
                description: 'Failed to Load the Events',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoadingPast(false);
        }
    };

    return (
        <>
            <Static>
                <Flex
                    pb={['10px', '30px']}
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Heading as='h1' size='lg' fontWeight='500'>
                        Events
                    </Heading>
                </Flex>
                <Box pb='30px'>
                    <ul className='tab-nav'>
                        <li
                            onClick={() => setActiveTab(1)}
                            className={activeTab === 1 ? 'active' : ''}
                        >
                            Group Events
                        </li>
                        <li
                            onClick={() => setActiveTab(2)}
                            className={activeTab === 2 ? 'active' : ''}
                        >
                            Upcoming Events
                        </li>
                        <li
                            onClick={() => setActiveTab(3)}
                            className={activeTab === 3 ? 'active' : ''}
                        >
                            Previous Events
                        </li>
                    </ul>
                </Box>
                <div className='tab-content'>
                    {loading ? (
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            mt={44}
                        >
                            <Spinner
                                thickness='4px'
                                speed='0.2s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                    ) : (
                        <div
                            className={
                                'tab-content-item ' +
                                (activeTab === 1 ? 'current' : '')
                            }
                        >
                            <Grid
                                mb={['30px', '70px']}
                                templateColumns={[
                                    'repeat(1, 1fr)',
                                    'repeat(2, 1fr)',
                                    'repeat(3, 1fr)',
                                ]}
                                gap='2rem'
                                rowGap={['1.5rem', '3rem']}
                            >
                                {eventsList?.map((eventItem, index) => {
                                    return (
                                        <div key={index}>
                                            <EventCard
                                                key={eventItem._id}
                                                selectEvent={selectEvent}
                                                chatId={eventItem.chatId._id}
                                                index={index}
                                                id={eventItem._id}
                                                date={eventItem.date}
                                                time={eventItem.time}
                                                title={eventItem.name}
                                                description={
                                                    eventItem.description
                                                }
                                                imageUrl={eventItem?.thumbnail}
                                                fetchAgain={fetchAgain}
                                                setFetchAgain={setFetchAgain}
                                                eventsPage={true}
                                            />
                                        </div>
                                    );
                                })}
                            </Grid>
                            {eventsList.length > 0 ? (<Pagination
                                paginateFunction={fetchMoreEvents}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalCount={totalCount}
                                currentCount={currentCount}
                                hasNextPage={hasNextPage}
                                hasPrevPage={hasPrevPage}
                            />
                            ) : (
                                <NothingToShowMessage>
                                    Events
                                </NothingToShowMessage>
                            )}
                        </div>
                    )}

                    {loadingUpcoming ? (
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            mt={44}
                        >
                            <Spinner
                                thickness='4px'
                                speed='0.2s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                    ) : (
                        <div
                            className={
                                'tab-themes tab-content-item ' +
                                (activeTab === 2 ? 'current' : '')
                            }
                        >
                            <Grid
                                mb={['30px', '70px']}
                                templateColumns={[
                                    'repeat(1, 1fr)',
                                    'repeat(3, 1fr)',
                                ]}
                                gap='2rem'
                                rowGap={['1.5rem', '3rem']}
                            >
                                {upcomingEventsList?.map((eventItem, index) => {
                                    return (
                                        <div key={index}>
                                            <EventCard
                                                key={eventItem._id}
                                                selectEvent={selectEvent}
                                                chatId={eventItem.chatId}
                                                index={index}
                                                id={eventItem._id}
                                                date={eventItem.date}
                                                time={eventItem.time}
                                                title={eventItem.name}
                                                description={
                                                    eventItem.description
                                                }
                                                imageUrl={eventItem?.thumbnail}
                                                fetchAgain={fetchAgain}
                                                setFetchAgain={setFetchAgain}
                                                eventsPage={true}
                                            />
                                        </div>
                                    );
                                })}
                            </Grid>
                            {upcomingEventsList.length > 0 ? (<Pagination
                                paginateFunction={fetchAllUpcomingEvents}
                                currentPage={currentUpcomingPage}
                                totalPages={totalUpcomingPages}
                                totalCount={totalUpcomingCount}
                                currentCount={currentUpcomingCount}
                                hasNextPage={hasNextUpcomingPage}
                                hasPrevPage={hasPrevUpcomingPage}
                            />
                            ) : (
                                <NothingToShowMessage>
                                    Events
                                </NothingToShowMessage>
                            )}
                        </div>
                    )}

                    {loadingPast ? (
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            mt={44}
                        >
                            <Spinner
                                thickness='4px'
                                speed='0.2s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                    ) : (
                        <div
                            className={
                                'tab-content-item ' +
                                (activeTab === 3 ? 'current' : '')
                            }
                        >
                            <Grid
                                mb={['30px', '70px']}
                                templateColumns={[
                                    'repeat(1, 1fr)',
                                    'repeat(3, 1fr)',
                                ]}
                                gap='2rem'
                                rowGap={['1.5rem', '3rem']}
                            >
                                {pastEventsList?.map((eventItem, index) => {
                                    return (
                                        <div key={index}>
                                            <EventCard
                                                key={eventItem._id}
                                                selectEvent={selectEvent}
                                                chatId={eventItem.chatId}
                                                index={index}
                                                id={eventItem._id}
                                                date={eventItem.date}
                                                time={eventItem.time}
                                                title={eventItem.name}
                                                description={
                                                    eventItem.description
                                                }
                                                imageUrl={eventItem?.thumbnail}
                                                fetchAgain={fetchAgain}
                                                setFetchAgain={setFetchAgain}
                                                eventsPage={true}
                                            />
                                        </div>
                                    );
                                })}
                            </Grid>
                            {pastEventsList.length > 0 ? (<Pagination
                                paginateFunction={fetchAllPastEvents}
                                currentPage={currentPastPage}
                                totalPages={totalPastPages}
                                totalCount={totalPastCount}
                                currentCount={currentPastCount}
                                hasNextPage={hasNextPastPage}
                                hasPrevPage={hasPrevPastPage}
                            />
                            ) : (
                                <NothingToShowMessage>
                                    Events
                                </NothingToShowMessage>
                            )}
                        </div>
                    )}
                </div>
            </Static>
            <JoinGroupModal
                chatName={chatName}
                isOpenJoinEvent={isOpenJoinEvent}
                onOpenJoinEvent={onOpenJoinEvent}
                onCloseJoinEvent={onCloseJoinEvent}
                chatId={chatId}
            />
        </>
    );
}

export default Events;
