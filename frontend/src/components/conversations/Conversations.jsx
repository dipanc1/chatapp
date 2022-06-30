import axios from 'axios'
import React from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import { backend_url } from '../../production'
import Conversation from '../conversation/Conversation'
import GroupChat from '../groupchat/GroupChat'
import GroupChatModal from '../GroupChatModal/GroupChatModal'
import Loading from '../Loading'
import GroupListItem from '../UserAvatar/GroupListItem'
import UserListItem from '../UserAvatar/UserListItem'
import "./conversations.scss"
import { motion } from "framer-motion"
import {
    Input,
    Text,
    Divider,
    Spinner,
    Box,
    Button
} from '@chakra-ui/react'
import {
    AddIcon,
    ChevronDownIcon, ChevronUpIcon
} from '@chakra-ui/icons'

const Conversations = ({ fetchAgain, setFetchAgain }) => {
    const { dispatch, chats, selectedChat, mobile } = React.useContext(PhoneNumberContext);
    const [dropdown, setDropdown] = React.useState(true);
    const [dropdownGroup, setDropdownGroup] = React.useState(true);
    const [conversations, setConversations] = React.useState([])
    const [groupConversations, setGroupConversations] = React.useState([])
    const [search, setSearch] = React.useState('')
    const [searchResultsUsers, setSearchResultsUsers] = React.useState([])
    const [searchResultsGroups, setSearchResultsGroups] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const user = JSON.parse(localStorage.getItem('user'))


    // search bar to search for users
    const handleSearch = async (e) => {
        setSearch(e.target.value)
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
            // console.log(data);
            setLoading(false);
            setSearchResultsUsers(data.users);
            setSearchResultsGroups(data.groupName);
        } catch (error) {
            console.log(error)
        }
    }

    // add user to conversation
    const accessChat = async (userId) => {
        // console.log(userId);
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`${backend_url}/conversation`, { userId }, config);

            dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
            // console.log(data);
            setLoading(false);
            setSearch('');
            setFetchAgain(!fetchAgain);
        } catch (error) {
            console.log(error)
        }
    }

    // fetch all conversations
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/conversation`, config);

            setConversations(data.filter(friend => !friend.isGroupChat));
            setGroupConversations(data.filter(friend => friend.isGroupChat && friend.chatName));

            if (!chats.find(chat => chat._id === data.map(datas => datas._id))) {
                dispatch({ type: 'SET_CHATS', payload: data })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleAddUser = async (user1, groupId) => {
        const res = searchResultsGroups.map(group => group.users).includes(user1);
        console.log(user1)
        console.log(res);
        if (res) {
            console.log("user already in chat")
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
                    chatId: groupId,
                    userId: user1,
                },
                config
            );
            console.log(data);
            dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        setSearch('');

    }

    React.useEffect(() => {
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain])

    const variants = {
        open: { opacity: 1, y: 1 },
        closed: { opacity: 0, y: "-100%" },
    }

    const variants1 = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    }


    return (
        <Box
            bg={'white'}
            height={'100%'}
        // width={'17rem'}
        >
            <Box
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Input
                    borderRadius={'0.8rem'}
                    width={'80%'}
                    py={'0.8rem'}
                    fontWeight={'bold'}
                    mx={'auto'}
                    ml={'1.8rem'}
                    placeholder='Start a new conversation'
                    value={search}
                    onChange={handleSearch}
                    focusBorderColor='#9F85F7'
                />
            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                padding={'1rem'}
                px={'2rem'}
            >
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                >
                    Conversations
                </Text>
                {
                    dropdown ?
                        <ChevronDownIcon
                            onClick={() => setDropdown(!dropdown)}
                            _hover={{ scale: 1.05 }}
                            cursor="pointer"
                            /> :
                            <ChevronUpIcon
                            onClick={() => setDropdown(!dropdown)}
                            _hover={{ scale: 1.05 }}
                            cursor="pointer"
                        />
                }
            </Box>
            <Divider orientation='horizontal' />

            <Box
                display={'flex'}
                flexDirection={'column'}
                maxHeight={'27vh'}
                overflow={'scroll'}
                overflowX={'hidden'}
                animate={dropdown ? "open" : "closed"}
                variants={variants}
            >
                {
                    loading ?
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Spinner
                                thickness='4px'
                                speed='0.45s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                        :
                        search.length > 0 ?
                            searchResultsUsers?.map(user => (
                                <Box
                                    _hover={{
                                        background: 'selectPrimaryColor',
                                        fontWeight: 'bold',

                                    }}
                                    bg={'#E8E8E8'}
                                    p={2}
                                    cursor={'pointer'}
                                    my={'0.2rem'}
                                    mx={'2rem'}
                                    borderRadius="lg"
                                    key={user._id}
                                    onClick={() => accessChat(user._id)}
                                >
                                    <UserListItem user={user}
                                    />
                                </Box>
                            ))
                            : !dropdown ?
                                null
                                :
                                conversations.map((c) => (
                                    <Box
                                        _hover={{
                                            background: 'selectPrimaryColor',
                                            fontWeight: 'bold',
                                        }}
                                        bg={selectedChat?._id === c._id ? 'selectPrimaryColor' : '#E8E8E8'}
                                        p={2}
                                        cursor={'pointer'}
                                        my={'0.2rem'}
                                        mx={'2rem'}
                                        borderRadius="lg"
                                        key={c._id}
                                        onClick={() => {
                                            dispatch({ type: "SET_SELECTED_CHAT", payload: c })
                                            dispatch({ type: "SET_MOBILE" })
                                        }}
                                    >
                                        <Conversation chat={c} />
                                    </Box>
                                ))

                }
                {conversations.length === 0 ?
                    <Box
                        initial="hidden"
                        animate="visible"
                        variants={variants1}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Text cursor={'default'} color={'buttonPrimaryColor'} fontSize={'3xl'}>No Conversations</Text>
                    </Box> : null}
            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                padding={'1rem'}
                px={'2rem'}
            >
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >Groups
                </Text>
                <Box>

                    <GroupChatModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                        <Button
                            color={'#3CC4B7'}
                            _hover={{ scale: 1.05 }}
                            variant='outline'
                            size={'xs'}
                            cursor="pointer"
                            mr={'2'}
                        >
                            <AddIcon />
                        </Button>
                    </GroupChatModal>
                    {dropdownGroup ?
                        <ChevronDownIcon
                            onClick={() => setDropdownGroup(!dropdownGroup)}
                            _hover={{ scale: 1.05 }}
                            cursor="pointer"
                        /> :
                        <ChevronUpIcon
                            onClick={() => setDropdownGroup(!dropdownGroup)}
                            _hover={{ scale: 1.05 }}
                            cursor="pointer"
                        />
                    }
                </Box>
            </Box>
            <Divider orientation='horizontal' />

            <Box
                display={'flex'}
                flexDirection={'column'}
                maxHeight={'27vh'}
                overflow={'scroll'}
                overflowX={'hidden'}
                animate={dropdownGroup ? "open" : "closed"}
                variants={variants}
            >
                {
                    loading ?
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                        :
                        search.length > 0 ?
                            searchResultsGroups?.map(group => (
                                <Box
                                    _hover={{
                                        background: 'selectPrimaryColor',
                                        fontWeight: 'bold',
                                    }}
                                    bg={'#E8E8E8'}
                                    p={2}
                                    cursor={'pointer'}
                                    my={'0.2rem'}
                                    mx={'2rem'}
                                    borderRadius="lg"
                                    key={group._id}
                                    onClick={() => handleAddUser(user._id, group._id)}
                                >
                                    <GroupListItem group={group}
                                    />
                                </Box>
                            ))
                            :
                            !dropdownGroup
                                ?
                                null
                                :
                                groupConversations.map((c) => (
                                    <Box
                                        _hover={{
                                            background: 'selectPrimaryColor',
                                            fontWeight: 'bold',
                                        }}
                                        bg={selectedChat?._id === c._id ? 'selectPrimaryColor' : '#E8E8E8'}
                                        p={2}
                                        cursor={'pointer'}
                                        my={'0.2rem'}
                                        mx={'2rem'}
                                        borderRadius="lg"
                                        key={c._id}
                                        onClick={() => {
                                            dispatch({ type: "SET_SELECTED_CHAT", payload: c })
                                            dispatch({ type: "SET_MOBILE" })
                                        }}
                                    >
                                        <GroupChat chat={c} />
                                    </Box>
                                ))
                }
                {groupConversations.length === 0
                    ?
                    <Box
                        initial="hidden"
                        animate="visible"
                        variants={variants1}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Text cursor={'default'} color={'buttonPrimaryColor'} fontSize={'3xl'}>No Groups</Text>
                    </Box>
                    :
                    null}
            </Box>
        </Box>
    )
}

export default Conversations