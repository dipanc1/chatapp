import axios from 'axios'
import React from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import Conversation from '../conversation/Conversation'
import GroupChat from '../groupchat/GroupChat'
import GroupChatModal from '../groupchatmodal/GroupChatModal'
import Loading from '../Loading'
import GroupListItem from '../UserAvatar/GroupListItem'
import UserListItem from '../UserAvatar/UserListItem'
import "./conversations.scss"

const Conversations = () => {
    const { dispatch, selectedChat, chats } = React.useContext(PhoneNumberContext);
    const [loggedUser, setLoggedUser] = React.useState();
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
            const { data } = await axios.get(`http://localhost:8000/users?search=${search}`, config)
            console.log(data);
            setLoading(false);
            setSearchResultsUsers(data.users);
            setSearchResultsGroups(data.groupName);
        } catch (error) {
            console.log(error)
        }
    }

    // add user to conversation
    const accessChat = async (userId) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`http://localhost:8000/conversation`, { userId }, config)
            console.log(data);
            setLoading(false);
            setSearch('');
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
            const { data } = await axios.get(`http://localhost:8000/conversation`, config);

            console.log(data);

            setConversations((data.map(friend => friend.isGroupChat ? null : friend.users.find(member => member._id !== user._id))).filter(friend => friend !== null).map(friend => friend))
            setGroupConversations(data.filter(friend => friend.isGroupChat && friend.chatName))
            if (!chats.find(chat => chat._id === data._id)) {
                dispatch({ type: 'SET_CHATS', payload: data })
            }
            // dispatch({ type: 'SET_SELECTED_CHAT', payload: data })

            console.log(groupConversations);
            //make similar function for group chat
        } catch (error) {
            console.log(error)
        }
    }
    React.useEffect(() => {
        setLoggedUser(user);
        fetchChats();
    }, [])


    return (
        <div className='conversations'>
            <div className="search">
                <input
                    type="text"
                    id="search"
                    name='search'
                    placeholder='Search'
                    value={search}
                    onChange={handleSearch}
                />
            </div>
            <div className="conversations-list">
                <div className="conversation-title">
                    <h5>Conversations</h5>
                    <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' onClick={() => setDropdown(!dropdown)} />
                </div>
                <hr style={{ 'color': "#f3f7fc" }} />
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
                                null :
                                conversations.map((c) => (
                                    <div className={selectedChat ? "conversation-avatar-name" : "conversation-avatar-name.disabled"} key={c._id}
                                        onClick={() => dispatch({ type: "SET_SELECTED_CHAT", payload: c })}
                                    >
                                        <Conversation chat={c} />
                                    </div>
                                ))
                }
            </div>

            <div className="groups-list">
                <div className="group-title">
                    <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' onClick={() => setDropdownGroup(!dropdownGroup)}/>
                    <h5>Groups</h5>
                    <GroupChatModal user={user}>
                        <button className='groupChatButton'>+</button>
                    </GroupChatModal>
                </div>
                <hr style={{ 'color': "#f3f7fc" }} />
                {
                    loading ?
                        <div className="loading">
                            <Loading />
                        </div>
                        :
                        search.length > 0 ?
                            searchResultsGroups?.map(group => (
                                <div className="group-icon-name" key={group._id}
                                    onClick={() => accessChat(group._id)}
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
                                    <div className="group-icon-name" key={c._id}
                                        onClick={() => dispatch({ type: "SET_SELECTED_CHAT", payload: c })}
                                    >
                                        <GroupChat chat={c} />
                                    </div>
                                ))
                }
            </div>
        </div>
    )
}

export default Conversations