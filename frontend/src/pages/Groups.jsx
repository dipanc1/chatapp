import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Box,
    Grid,
    Text,
    Heading,
    Flex,
    Image,
    UnorderedList,
    useToast,
    Spinner,
} from '@chakra-ui/react';

import Static from '../components/common/Static';
import GroupCard from '../components/Groups/GroupCard';
import { AppContext } from '../context/AppContext';
import GroupChatModal from '../components/UserModals/GroupChatModal';
import Pagination from '../components/Miscellaneous/Pagination';
import Cookies from 'universal-cookie';

import conversationApi from '../services/apis/conversationApi';
import { ONE } from '../constants';
import NothingToShowMessage from '../components/Miscellaneous/NothingToShowMessage';

function Groups() {
    const cookies = new Cookies();
    const user =
        JSON.parse(localStorage.getItem('user')) ||
        cookies.get(
            'auth_token',
            { domain: '.fundsdome.com' || 'localhost' },
            { path: '/' },
        );
    const [activeTab, setActiveTab] = useState(1);
    const [fetchAgain, setFetchAgain] = useState(false);

    const [groupsList, setGroupsList] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    const [groupConversations, setGroupConversations] = React.useState([]);
    const [upcomingEventsMyChats, setUpcomingEventsMyChats] = useState([]);
    const [loadingMyChats, setLoadingMyChats] = useState(false);
    const [totalCountMyChats, setTotalCountMyChats] = useState(0);
    const [currentPageMyChats, setCurrentPageMyChats] = useState(1);
    const [totalPagesMyChats, setTotalPagesMyChats] = useState(0);
    const [currentCountMyChats, setCurrentCountMyChats] = useState(0);
    const [hasNextPageMyChats, setHasNextPageMyChats] = useState(false);
    const [hasPrevPageMyChats, setHasPrevPageMyChats] = useState(false);

    const [groupConversationsAdmin, setGroupConversationsAdmin] =
        React.useState([]);
    const [upcomingEventsMyChatsAdmin, setUpcomingEventsMyChatsAdmin] =
        useState([]);
    const [loadingMyChatsAdmin, setLoadingMyChatsAdmin] = useState(false);
    const [totalCountMyChatsAdmin, setTotalCountMyChatsAdmin] = useState(0);
    const [currentPageMyChatsAdmin, setCurrentPageMyChatsAdmin] = useState(1);
    const [totalPagesMyChatsAdmin, setTotalPagesMyChatsAdmin] = useState(0);
    const [currentCountMyChatsAdmin, setCurrentCountMyChatsAdmin] = useState(0);
    const [hasNextPageMyChatsAdmin, setHasNextPageMyChatsAdmin] =
        useState(false);
    const [hasPrevPageMyChatsAdmin, setHasPrevPageMyChatsAdmin] =
        useState(false);

    const { userInfo } = React.useContext(AppContext);

    const toast = useToast();

    useEffect(() => {
        // fetch all conversations
        const fetchChats = async () => {
            setLoadingMyChats(true);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await conversationApi.fetchGroupWhereIamPart(
                    ONE,
                    config,
                );
                setGroupConversations(
                    data.chats.filter(
                        (friend) => friend.isGroupChat && friend.chatName,
                    ),
                );
                setUpcomingEventsMyChats(data.upcomingEvents);
                setTotalCountMyChats(data.totalCount);
                setCurrentPageMyChats(data.currentPage);
                setTotalPagesMyChats(data.totalPages);
                setCurrentCountMyChats(data.currentCount);
                setHasNextPageMyChats(data.hasNextPage);
                setHasPrevPageMyChats(data.hasPrevPage);
                setLoadingMyChats(false);
            } catch (error) {
                // console.log(error)
                setLoadingMyChats(false);
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to Load the Conversations',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left',
                });
            }
        };

        // fetch all conversations as admin
        const fetchChatsAdmin = async () => {
            setLoadingMyChatsAdmin(true);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await conversationApi.fetchGroupWhereAdmin(
                    ONE,
                    config,
                );
                setGroupConversationsAdmin(data.chats);
                setUpcomingEventsMyChatsAdmin(data.upcomingEvents);
                setTotalCountMyChatsAdmin(data.totalCount);
                setCurrentPageMyChatsAdmin(data.currentPage);
                setTotalPagesMyChatsAdmin(data.totalPages);
                setCurrentCountMyChatsAdmin(data.currentCount);
                setHasNextPageMyChatsAdmin(data.hasNextPage);
                setHasPrevPageMyChatsAdmin(data.hasPrevPage);
                setLoadingMyChatsAdmin(false);
            } catch (error) {
                // console.log(error)
                setLoadingMyChats(false);
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to Load the Conversations',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left',
                });
            }
        };

        const listGroups = async () => {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await conversationApi
                .fetchGroups(ONE, config)
                .then((response) => {
                    setGroupsList(response.data.groups);
                    setUpcomingEvents(response.data.upcomingEvents);
                    setTotalCount(response.data.totalCount);
                    setCurrentPage(response.data.currentPage);
                    setTotalPages(response.data.totalPages);
                    setCurrentCount(response.data.currentCount);
                    setHasNextPage(response.data.hasNextPage);
                    setHasPrevPage(response.data.hasPrevPage);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        };

        switch (activeTab) {
            case 1:
                listGroups();
                break;
            case 2:
                fetchChats();
                break;
            default:
                fetchChatsAdmin();
                break;
        }
    }, [toast, user?.token, fetchAgain, activeTab]);

    const listMoreGroups = async (page) => {
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        await conversationApi
            .fetchGroups(page, config)
            .then((response) => {
                setGroupsList(response.data.groups);
                setUpcomingEvents(response.data.upcomingEvents);
                setTotalCount(response.data.totalCount);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setCurrentCount(response.data.currentCount);
                setHasNextPage(response.data.hasNextPage);
                setHasPrevPage(response.data.hasPrevPage);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const fetchMoreChats = async (page) => {
        setLoadingMyChats(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await conversationApi.fetchGroupWhereIamPart(
                page,
                config,
            );
            setGroupConversations(
                data.chats.filter(
                    (friend) => friend.isGroupChat && friend.chatName,
                ),
            );
            setUpcomingEventsMyChats(data.upcomingEvents);
            setTotalCountMyChats(data.totalCount);
            setCurrentPageMyChats(data.currentPage);
            setTotalPagesMyChats(data.totalPages);
            setCurrentCountMyChats(data.currentCount);
            setHasNextPageMyChats(data.hasNextPage);
            setHasPrevPageMyChats(data.hasPrevPage);
            setLoadingMyChats(false);
        } catch (error) {
            // console.log(error)
            setLoadingMyChats(false);
            toast({
                title: 'Error Occured!',
                description: 'Failed to Load the Conversations',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    const fetchMoreChatsAdmin = async (page) => {
        setLoadingMyChatsAdmin(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await conversationApi.fetchGroupWhereAdmin(
                page,
                config,
            );
            setGroupConversationsAdmin(data.chats);
            setUpcomingEventsMyChatsAdmin(data.upcomingEvents);
            setTotalCountMyChatsAdmin(data.totalCount);
            setCurrentPageMyChatsAdmin(data.currentPage);
            setTotalPagesMyChatsAdmin(data.totalPages);
            setCurrentCountMyChatsAdmin(data.currentCount);
            setHasNextPageMyChatsAdmin(data.hasNextPage);
            setHasPrevPageMyChatsAdmin(data.hasPrevPage);
            setLoadingMyChatsAdmin(false);
        } catch (error) {
            // console.log(error)
            setLoadingMyChats(false);
            toast({
                title: 'Error Occured!',
                description: 'Failed to Load the Conversations',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
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
                        Groups
                    </Heading>
                    <GroupChatModal
                        user={userInfo}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    >
                        <NavLink className='btn btn-primary'>
                            <Flex alignItems='center'>
                                <Image
                                    h='18px'
                                    pe='15px'
                                    src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620'
                                />
                                <Text>Create New</Text>
                            </Flex>
                        </NavLink>
                    </GroupChatModal>
                </Flex>

                <UnorderedList ps='0' ms='0' mb='30px' className='tab-nav'>
                    <li
                        onClick={() => setActiveTab(1)}
                        className={activeTab === 1 ? 'active' : ''}
                    >
                        All Groups
                    </li>
                    <li
                        onClick={() => setActiveTab(2)}
                        className={activeTab === 2 ? 'active' : ''}
                    >
                        Joined Groups
                    </li>
                    <li
                        onClick={() => setActiveTab(3)}
                        className={activeTab === 3 ? 'active' : ''}
                    >
                        My Groups
                    </li>
                </UnorderedList>
                <div className='tab-content'>
                    {loading ? (
                        <Box
                            py='100px'
                            background='transparent'
                            textAlign='center'
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
                                className='bg-variants'
                                mb='70px'
                                templateColumns={[
                                    'repeat(1, 1fr)',
                                    'repeat(2, 1fr)',
                                ]}
                                gap='2rem'
                                rowGap={['1.5rem', '3rem']}
                            >
                                {groupsList.map((groupItem) => (
                                    <GroupCard
                                        key={groupItem._id}
                                        chatId={groupItem._id}
                                        name={groupItem.chatName}
                                        members={groupItem.users}
                                        admin={groupItem.groupAdmin}
                                        upcomingEvents={upcomingEvents}
                                        isAdmin={
                                            userInfo._id ===
                                            groupItem.groupAdmin._id
                                        }
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                ))}
                            </Grid>
                            {groupsList.length > 0 ? (
                                <Pagination
                                    paginateFunction={listMoreGroups}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalCount={totalCount}
                                    currentCount={currentCount}
                                    hasNextPage={hasNextPage}
                                    hasPrevPage={hasPrevPage}
                                />
                            ) : (
                                <NothingToShowMessage>
                                    Groups
                                </NothingToShowMessage>
                            )}
                        </div>
                    )}
                    {loadingMyChats ? (
                        <Box
                            py='100px'
                            background='transparent'
                            textAlign='center'
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
                                className='bg-variants'
                                mb='70px'
                                templateColumns={[
                                    'repeat(1, 1fr)',
                                    'repeat(2, 1fr)',
                                ]}
                                gap='2rem'
                                rowGap={['1.5rem', '3rem']}
                            >
                                {groupConversations.map((groupItem) => (
                                    <GroupCard
                                        key={groupItem._id}
                                        chatId={groupItem._id}
                                        name={groupItem.chatName}
                                        members={groupItem.users}
                                        upcomingEvents={upcomingEventsMyChats}
                                        isAdmin={
                                            userInfo._id ===
                                            groupItem.groupAdmin._id
                                        }
                                        admin={groupItem.groupAdmin}
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                ))}
                            </Grid>
                            {groupConversations.length > 0 ? (
                                <Pagination
                                    paginateFunction={fetchMoreChats}
                                    currentPage={currentPageMyChats}
                                    totalPages={totalPagesMyChats}
                                    totalCount={totalCountMyChats}
                                    currentCount={currentCountMyChats}
                                    hasNextPage={hasNextPageMyChats}
                                    hasPrevPage={hasPrevPageMyChats}
                                />
                            ) : (
                                <NothingToShowMessage>
                                    Groups
                                </NothingToShowMessage>
                            )}
                        </div>
                    )}
                    {loadingMyChatsAdmin ? (
                        <Box
                            py='100px'
                            background='transparent'
                            textAlign='center'
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
                                (activeTab === 3 ? 'current' : '')
                            }
                        >
                            <Grid
                                className='bg-variants'
                                mb='70px'
                                templateColumns={[
                                    'repeat(1, 1fr)',
                                    'repeat(2, 1fr)',
                                ]}
                                gap='2rem'
                                rowGap={['1.5rem', '3rem']}
                            >
                                {groupConversationsAdmin.map((groupItem) => (
                                    <GroupCard
                                        key={groupItem._id}
                                        chatId={groupItem._id}
                                        name={groupItem.chatName}
                                        members={groupItem.users}
                                        upcomingEvents={
                                            upcomingEventsMyChatsAdmin
                                        }
                                        isAdmin={
                                            userInfo._id ===
                                            groupItem.groupAdmin._id
                                        }
                                        admin={groupItem.groupAdmin}
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                ))}
                            </Grid>
                            {groupConversationsAdmin.length > 0 ? (
                                <Pagination
                                    paginateFunction={fetchMoreChatsAdmin}
                                    currentPage={currentPageMyChatsAdmin}
                                    totalPages={totalPagesMyChatsAdmin}
                                    totalCount={totalCountMyChatsAdmin}
                                    currentCount={currentCountMyChatsAdmin}
                                    hasNextPage={hasNextPageMyChatsAdmin}
                                    hasPrevPage={hasPrevPageMyChatsAdmin}
                                />
                            ) : (
                                <NothingToShowMessage>
                                    Groups
                                </NothingToShowMessage>
                            )}
                        </div>
                    )}
                </div>
            </Static>
        </>
    );
}

export default Groups;
