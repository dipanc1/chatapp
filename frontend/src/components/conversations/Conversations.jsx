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

const Conversations = ({ fetchAgain, setFetchAgain }) => {
    const { dispatch, chats, selectedChat } = React.useContext(PhoneNumberContext);
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


    return (
        <div className='conversations'>
            <div className="search">
                <input
                    type="text"
                    id="search"
                    name='search'
                    placeholder='Start a new conversation'
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            {/* <hr style={{ 'color': "#f3f7fc" }} /> */}
            <div className="conversation-title">
                <h5>Conversations</h5>
                <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' style={{ transform: !dropdown ? 'rotate(180deg)' : null }} onClick={() => setDropdown(!dropdown)} />
            </div>
            <hr style={{ 'color': "#f3f7fc", display: dropdown ? 'block' : 'none' }} />
            <div className="conversations-list">
                {
                    loading ?
                        <div className="loading">
                            <Loading />
                        </div>
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
                                        onClick={() => dispatch({ type: "SET_SELECTED_CHAT", payload: c })}
                                    >
                                        <Conversation chat={c} />
                                    </div>
                                ))

                }
                {conversations.length === 0 ? <div className="noChat">
                    <h5>No Conversations</h5>
                </div> : null}
            </div>

            {/* <hr style={{ 'color': "#f3f7fc" }} /> */}
            <div className="group-title">
                <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' onClick={() => setDropdownGroup(!dropdownGroup)} style={{ transform: !dropdownGroup ? 'rotate(180deg)' : null }} />
                <h5>Groups</h5>
                <GroupChatModal user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                    <button className='groupChatButton'>+</button>
                </GroupChatModal>
            </div>
            <hr style={{ 'color': "#f3f7fc" }} />
            <div className="groups-list">
                {
                    loading ?
                        <div className="loading">
                            <Loading />
                        </div>
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
                                        onClick={() => dispatch({ type: "SET_SELECTED_CHAT", payload: c })}
                                    >
                                        <GroupChat chat={c} />
                                    </div>
                                ))
                }
                {groupConversations.length === 0
                    ?
                    <div className="noGroup">
                        <h5>No Groups</h5>
                    </div>
                    :
                    null}
            </div>
        </div >
    )
}

export default Conversations