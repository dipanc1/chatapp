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
    Center,
    Box,
    Button
} from '@chakra-ui/react'
import {
    AddIcon,
    ChevronDownIcon, ChevronUpIcon, PlusSquareIcon
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

            // console.log(conversations);
            // console.log(groupConversations);
            // setConversations((data.map(friend => friend.isGroupChat ? null : friend.users.find(member => member._id !== user._id))).filter(friend => friend !== null).map(friend => friend));

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
        <div className={mobile ? 'conversationsMobile' : 'conversations'}>
            <motion.div className="search"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Input
                    placeholder='Start a new conversation'
                    value={search}
                    onChange={handleSearch}
                />
            </motion.div>

            <motion.div className="conversation-title">
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
            </motion.div>
            <Divider orientation='horizontal' />

            <motion.div className="conversations-list"
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
                                color='blue.500'
                                size='xl'
                            />
                        </Box>
                        :
                        search.length > 0 ?
                            searchResultsUsers?.map(user => (
                                <div className="conversation-avatar-name" key={user._id}
                                    onClick={() => accessChat(user._id)}
                                >
                                    <UserListItem user={user}
                                    />
                                </div>
                            ))
                            : !dropdown ?
                                null
                                :
                                conversations.map((c) => (
                                    <div
                                        className={selectedChat?._id === c._id ? "conversation-avatar-name-disabled" : "conversation-avatar-name"}
                                        key={c._id}
                                        onClick={() => {
                                            dispatch({ type: "SET_SELECTED_CHAT", payload: c })
                                            dispatch({ type: "SET_MOBILE" })
                                        }}
                                    >
                                        <Conversation chat={c} />
                                    </div>
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
                        <Text color={'blue'} fontSize={'3xl'}>No Conversations</Text>
                    </Box> : null}
            </motion.div>

            <div className="group-title"
            >
                {dropdownGroup?

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
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >Groups
                </Text>
                <GroupChatModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                    <Button
                        variantColor="blue"
                        // onClick={() => setShowModal(true)}
                        _hover={{ scale: 1.05 }}
                        cursor="pointer"
                    >
                        <AddIcon />
                    </Button>
                </GroupChatModal>
            </div>
            <hr style={{ 'color': "#f3f7fc" }} />
            <motion.div className="groups-list"
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
                                color='blue.500'
                                size='xl'
                            />
                        </Box>
                        :
                        search.length > 0 ?
                            searchResultsGroups?.map(group => (
                                <div className="group-icon-name" key={group._id}
                                    onClick={() => handleAddUser(user._id, group._id)}
                                >
                                    <GroupListItem group={group}
                                    />
                                </div>
                            ))
                            :
                            !dropdownGroup
                                ?
                                null
                                :
                                groupConversations.map((c) => (
                                    <div
                                        className={selectedChat?._id === c._id ? "group-icon-name-disabled" : "group-icon-name"}
                                        key={c._id}
                                        onClick={() => {
                                            dispatch({ type: "SET_SELECTED_CHAT", payload: c })
                                            dispatch({ type: "SET_MOBILE" })
                                        }}
                                    >
                                        <GroupChat chat={c} />
                                    </div>
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
                        <Text color={'blue'} fontSize={'3xl'}>No Groups</Text>
                    </Box>
                    :
                    null}
            </motion.div>
        </div >
    )
}

export default Conversations