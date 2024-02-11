import React from 'react';
import { AppContext } from '../../context/AppContext';
import Conversation from '../Miscellaneous/Conversation';
import GroupChat from '../Miscellaneous/GroupChat';
import GroupChatModal from '../UserModals/GroupChatModal';
import {
    Text,
    Spinner,
    Box,
    Button,
    Image,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    useColorMode,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import conversationApi from '../../services/apis/conversationApi';
import { ONE } from '../../constants';
import Cookies from 'universal-cookie';

export const DrawerConversations = ({ fetchAgain, setFetchAgain }) => {
    const {
        dispatch,
        chats,
        selectedChat,
        conversations,
        groupConversations,
        loading,
        userInfo,
    } = React.useContext(AppContext);

    const [hasMoreGroupChats, setHasMoreGroupChats] = React.useState(true);
    const [groupChatsPage, setGroupChatsPage] = React.useState(2);
    const { colorMode } = useColorMode();

    const [hasMoreOneOnOneChats, setHasMoreOneOnOneChats] =
        React.useState(true);
    const [oneOnOneChatsPage, setOneOnOneChatsPage] = React.useState(2);

    const cookies = new Cookies();
    const user =
        JSON.parse(localStorage.getItem('user')) ||
        cookies.get(
            'auth_token',
            { domain: '.fundsdome.com' || 'localhost' },
            { path: '/' },
        );

    const fetchOneOnOneChats = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await conversationApi.getOneOnOne(ONE, config);

            dispatch({ type: 'SET_CONVERSATIONS', payload: data.chats });
            setHasMoreOneOnOneChats(data.hasMore);

            if (
                !chats.find(
                    (chat) => chat._id === data.chats.map((datas) => datas._id),
                )
            ) {
                dispatch({ type: 'SET_CHATS', payload: data.chats });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchGroupChats = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await conversationApi.getGroupChats(ONE, config);

            dispatch({ type: 'SET_GROUP_CONVERSATIONS', payload: data.groups });
            setHasMoreGroupChats(data.hasMore);

            if (
                !chats.find(
                    (chat) =>
                        chat._id === data.groups.map((datas) => datas._id),
                )
            ) {
                dispatch({ type: 'SET_CHATS', payload: data.groups });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMoreOneOnOneChats = async () => {
        setOneOnOneChatsPage(oneOnOneChatsPage + 1);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await conversationApi.getOneOnOne(
                oneOnOneChatsPage,
                config,
            );

            dispatch({
                type: 'SET_CONVERSATIONS',
                payload: [...conversations, ...data.chats],
            });
            setHasMoreOneOnOneChats(data.hasMore);

            if (
                !chats.find(
                    (chat) => chat._id === data.chats.map((datas) => datas._id),
                )
            ) {
                dispatch({ type: 'SET_CHATS', payload: data.chats });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMoreGroupChats = async () => {
        setGroupChatsPage(groupChatsPage + 1);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await conversationApi.getGroupChats(
                groupChatsPage,
                config,
            );

            dispatch({
                type: 'SET_GROUP_CONVERSATIONS',
                payload: [...groupConversations, ...data.groups],
            });
            setHasMoreGroupChats(data.hasMore);

            if (
                !chats.find(
                    (chat) =>
                        chat._id === data.groups.map((datas) => datas._id),
                )
            ) {
                dispatch({ type: 'SET_CHATS', payload: data.groups });
            }
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        fetchGroupChats();
        fetchOneOnOneChats();
        setOneOnOneChatsPage(2);
        setGroupChatsPage(2);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain]);

    const variants1 = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    return (
        <>
            <Tabs width='100%' display='flex' flexDirection='column'>
                <TabList>
                    <Tab flex='1' fontWeight='500'>
                        Users
                    </Tab>
                    <Tab flex='1' fontWeight='500'>
                        Groups
                    </Tab>
                </TabList>

                <TabPanels flex='1' overflow='auto'>
                    <TabPanel p='0'>
                        {loading ? (
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <Spinner
                                    thickness='4px'
                                    speed='0.45s'
                                    emptyColor='gray.200'
                                    color='buttonPrimaryColor'
                                    size='xl'
                                />
                            </Box>
                        ) : (
                            <Box
                                pt='10px'
                                id='scrollableDiv'
                                style={{ height: '100%' }}
                            >
                                <InfiniteScroll
                                    dataLength={conversations.length}
                                    next={fetchMoreOneOnOneChats}
                                    hasMore={hasMoreOneOnOneChats}
                                    loader={
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                        >
                                            <Spinner
                                                thickness='4px'
                                                speed='0.65s'
                                                emptyColor='gray.200'
                                                color='buttonPrimaryColor'
                                                size='xl'
                                            />
                                        </Box>
                                    }
                                    scrollThreshold={0.9}
                                    height='100%'
                                    endMessage={
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                        >
                                            <Text
                                                color={'buttonPrimaryColor'}
                                                fontSize={'lg'}
                                            >
                                                No More Chats
                                            </Text>
                                        </Box>
                                    }
                                    scrollableTarget='scrollableDiv'
                                >
                                    {conversations.map((c) => (
                                        <Box
                                            _hover={{
                                                background: `${colorMode === 'light' ? 'selectPrimaryColor' : '#3f3f3f'}`,
                                            }}
                                            bg={
                                                selectedChat?._id === c._id
                                                    ? `${colorMode === 'light' ? 'selectPrimaryColor' : '#3f3f3f'}`
                                                    : ''
                                            }
                                            p={2}
                                            cursor={'pointer'}
                                            borderBottom={
                                                colorMode === 'light'
                                                    ? '1px solid #f5f5f7'
                                                    : '1px solid #3b3b3b'
                                            }
                                            maxW={'100%'}
                                            m='0 10px'
                                            borderRadius='5px'
                                            overflowX={'hidden'}
                                            key={c._id}
                                            _disabled={
                                                selectedChat?._id === c._id
                                            }
                                            onClick={() => {
                                                dispatch({
                                                    type: 'SET_SELECTED_CHAT',
                                                    payload: c,
                                                });
                                            }}
                                        >
                                            <Conversation chat={c} />
                                        </Box>
                                    ))}
                                </InfiniteScroll>
                            </Box>
                        )}
                        {conversations.length === 0 && !loading ? (
                            <Box
                                initial='hidden'
                                animate='visible'
                                variants={variants1}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                flexDirection={'column'}
                                my={'2'}
                            >
                                <Image src='./images/noconvo.png' w={'28'} />
                                <Text
                                    cursor={'default'}
                                    color={'buttonPrimaryColor'}
                                    fontSize={'3xl'}
                                >
                                    No Conversations
                                </Text>
                            </Box>
                        ) : null}
                        <Box mt='20px' textAlign='center'>
                            <Button
                                color={'#3CC4B7'}
                                _hover={{ scale: 1.05 }}
                                variant='outline'
                                size={'xs'}
                                cursor='pointer'
                                mr={'2'}
                                colorScheme='blue'
                                onClick={() => {
                                    setFetchAgain(!fetchAgain);
                                }}
                            >
                                <RepeatIcon />
                            </Button>
                        </Box>
                    </TabPanel>
                    <TabPanel p='0'>
                        {loading ? (
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='buttonPrimaryColor'
                                    size='xl'
                                />
                            </Box>
                        ) : (
                            <Box
                                pt='10px'
                                id='scrollableDiv'
                                style={{ height: '100%' }}
                            >
                                <InfiniteScroll
                                    dataLength={groupConversations.length}
                                    next={fetchMoreGroupChats}
                                    hasMore={hasMoreGroupChats}
                                    loader={
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                        >
                                            <Spinner
                                                thickness='4px'
                                                speed='0.65s'
                                                emptyColor='gray.200'
                                                color='buttonPrimaryColor'
                                                size='xl'
                                            />
                                        </Box>
                                    }
                                    scrollThreshold={0.9}
                                    height={300}
                                    endMessage={
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                        >
                                            <Text
                                                color={'buttonPrimaryColor'}
                                                fontSize={'lg'}
                                            >
                                                No More Groups
                                            </Text>
                                        </Box>
                                    }
                                    scrollableTarget='scrollableDiv'
                                >
                                    {groupConversations.map((c) => (
                                        <Box
                                            _hover={{
                                                background: `${colorMode === 'light' ? 'selectPrimaryColor' : '#3f3f3f'}`,
                                            }}
                                            bg={
                                                selectedChat?._id === c._id
                                                    ? `${colorMode === 'light' ? 'selectPrimaryColor' : '#3f3f3f'}`
                                                    : ''
                                            }
                                            p={2}
                                            cursor={'pointer'}
                                            borderBottom={
                                                colorMode === 'light'
                                                    ? '1px solid #f5f5f7'
                                                    : '1px solid #3b3b3b'
                                            }
                                            maxW={'100%'}
                                            m='0 10px'
                                            borderRadius='5px'
                                            key={c._id}
                                            _disabled={
                                                selectedChat?._id === c._id
                                            }
                                            onClick={() => {
                                                dispatch({
                                                    type: 'SET_SELECTED_CHAT',
                                                    payload: c,
                                                });
                                            }}
                                        >
                                            <GroupChat chat={c} />
                                        </Box>
                                    ))}
                                </InfiniteScroll>
                            </Box>
                        )}
                        {groupConversations.length === 0 && !loading ? (
                            <Box
                                initial='hidden'
                                animate='visible'
                                variants={variants1}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                flexDirection={'column'}
                            >
                                <Image src='./images/groupchat.png' w={'28'} />
                                <Text
                                    cursor={'default'}
                                    color={'buttonPrimaryColor'}
                                    fontSize={'3xl'}
                                >
                                    No Groups
                                </Text>
                                <GroupChatModal
                                    user={userInfo}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                >
                                    <Button
                                        backgroundColor={'buttonPrimaryColor'}
                                        color={'white'}
                                        size={'lg'}
                                        _hover={{
                                            bg: 'backgroundColor',
                                            color: 'text',
                                        }}
                                    >
                                        Create
                                    </Button>
                                </GroupChatModal>
                            </Box>
                        ) : null}
                        <Box mt='20px' textAlign='center'>
                            <GroupChatModal
                                user={userInfo}
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            >
                                <Button
                                    color={'#3CC4B7'}
                                    _hover={{ scale: 1.05 }}
                                    variant='outline'
                                    size={'xs'}
                                    cursor='pointer'
                                    mr={'2'}
                                    colorScheme='blue'
                                >
                                    <AddIcon />
                                </Button>
                            </GroupChatModal>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
};

const Conversations = ({ fetchAgain, setFetchAgain }) => {
    return (
        <>
            <Box bg={'whiteColor'} display='flex' width='100%'>
                <DrawerConversations
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                />
            </Box>
        </>
    );
};

export default Conversations;
