import axios from 'axios';
import { useContext, useState } from 'react';
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import Loading from '../Loading';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';
import './groupchatmodal.scss'

const GroupChatModal = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const { dispatch, chats } = useContext(PhoneNumberContext);
    const [show, setShow] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`http://localhost:8000/users?search=${search}`, config)
            // console.log(data.users);
            setLoading(false);
            setSearchResults(data.users);
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        if (!groupChatName || !selectedUsers.length) {
            console.log("Please enter a group chat name and select at least one user");
            return;
        }
        e.preventDefault();
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`http://localhost:8000/conversation/group`, { name: groupChatName, users: JSON.stringify(selectedUsers.map(u => u._id)) }, config)
            // console.log(chats);
            if (!chats.find(chat => chat._id === data._id)) {
                dispatch({ type: 'SET_CHATS', payload: data })
            }
            setLoading(false);
            setSearch('');
            setGroupChatName('');
            setSelectedUsers([]);
            setShow(false);
            console.log("Group chat created successfully");
        } catch (error) {
            console.log(error)
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            console.log('already added');
        } else {
            setSelectedUsers([...selectedUsers, userToAdd])
        }
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id))
    }


    return (
        <>
            {
                children ?
                    <span onClick={() => setShow(true)}>{children}</span> :
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/visible--v1.png" alt='show' onClick={() => setShow(true)} style={{ cursor: "pointer" }} />
            }
            {show &&
                <div className='groupModal'>
                    <div className="groupModalContainer">
                        <h1 className='modalUserName'>Create Group Chat</h1>
                        <form action="">
                            <div className="groupChatName">
                                <input type="text" placeholder="Group Name" onChange={(e) => setGroupChatName(e.target.value)} />
                            </div>
                            <div className="search">
                                <input
                                    type="text"
                                    id="search"
                                    name='search'
                                    placeholder='Add Users eg: Dipan, Abhishek, Vikram'
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </form>
                        <div className="badgeItem" style={{ display: 'flex', flexWrap: 'wrap' }} >
                            {selectedUsers.map(u =>
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)} />
                            )}
                        </div>
                        {loading ? <Loading /> :
                            <div className="searchResults">
                                {searchResults?.slice(0, 4).map(user => (
                                    <div className="searchAvatar" key={user._id} onClick={() => handleGroup(user)}
                                    >
                                        <UserListItem user={user}
                                        />
                                    </div>
                                ))}
                            </div>
                        }
                        <button className='modalUserButton' onClick={handleSubmit}>Create Chat</button>
                        <button className='modalUserButton' onClick={() => setShow(false)}>Close</button>
                    </div>
                </div>
            }
        </>
    )
}

export default GroupChatModal