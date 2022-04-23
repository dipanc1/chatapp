import React from 'react'
import ChatOnline from '../chatOnline/ChatOnline'
import "./members.scss"
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import axios from 'axios'
import Loading from '../Loading'
import UserListItem from '../UserAvatar/UserListItem'

const Members = ({ fetchAgain, setFetchAgain }) => {
  const [show, setShow] = React.useState(false);
  const [groupChatName, setGroupChatName] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false)
  const [profile, setProfile] = React.useState(null);

  const { selectedChat, dispatch } = React.useContext(PhoneNumberContext);
  const user = JSON.parse(localStorage.getItem('user'));


  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      return alert('You are not the admin of this group chat')
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:8000/conversation/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? dispatch({ type: 'SET_SELECTED_CHAT', payload: '' }) : dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
      setFetchAgain(!fetchAgain);
      setLoading(false);
      alert('User removed from group chat');
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find(u => u._id === user1._id)) {
      console.log("user already in chat")
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      console.log("you are not the admin")
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:8000/conversation/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
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

  const handleRename = async () => {
    if (!groupChatName) {
      return
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      const body = {
        chatName: groupChatName,
        chatId: selectedChat._id
      }
      const { data } = await axios.put(`http://localhost:8000/conversation/rename`, body, config)
      dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName('');
    } catch (err) {
      console.log(err)
      setRenameLoading(false);
    }
  }

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    setLoading(true);
    try {

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`http://localhost:8000/users?search=${search}`, config)
      setSearchResults(data.users);
      console.log(searchResults);
      setLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='members'>
      {selectedChat ? (
        <>
          <div className="member-title">
            {selectedChat.isGroupChat ?
              <h3> Group Info: <i style={{ color: '#004dfa' }}>{selectedChat?.chatName}</i></h3>
              :
              <h3>Personal Info: <i style={{ color: '#004dfa' }}>{selectedChat?.users.find(member => member._id !== user._id).username}</i></h3>
            }
          </div>
          <hr style={{ 'color': "#f3f7fc", marginBottom: '10px' }} />

          <div className='members-container'>

            {selectedChat.isGroupChat && selectedChat?.users.map(u =>
              <div className="member-avatar-name" key={u._id}>
                <ChatOnline
                  user1={u}
                  handleFunction={() => handleRemove(u)} />
              </div>
            )}

            {!selectedChat.isGroupChat && (
              <>
                <img src={selectedChat?.users.find(member => member._id !== user._id).pic} alt="user_image" className='modalUserImage' />
                <span className='modalUserText'>Phone Number:
                  <i style={{ color: '#004dfa' }}>
                    {selectedChat?.users.find(member => member._id !== user._id).number}
                  </i></span>
              </>
            )}

            {selectedChat.isGroupChat &&
              <>
                <div className="member-avatar-name-member">
                  <div className="member-name">
                    {show ?
                      <>
                        <img src="./images/add-user.png" alt="avatar" className='member-avatar' onClick={() => setShow(false)} />
                        <p>Add Member</p>
                      </>
                      :
                      <input value={search} type="text" placeholder="Search Member" onChange={handleSearch} />
                    }
                    {loading
                      ?
                      <div className="loading">
                        <Loading />
                      </div>
                      :
                      search.length > 0 &&
                      searchResults?.map(user => (
                        <div className="conversation-avatar-name" key={user._id}
                          onClick={() => handleAddUser(user._id)}
                        >
                          <UserListItem user={user}
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <form action="">
                  <div className="groupChatName">
                    <input value={groupChatName} type="text" placeholder="New Group Name" onChange={(e) => setGroupChatName(e.target.value)} />
                    <button
                      type="button"
                      onClick={handleRename}>
                      Update</button>
                  </div>
                </form>
                <div className="member-remove" onClick={() => handleRemove(user)}>
                  <img src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/000000/external-exit-essentials-tanah-basah-basic-outline-tanah-basah-2.png" alt='leave group' />
                  <p>Leave Group</p>
                </div>
              </>
            }
          </div>
        </>
      )
        :
        (<span className='noConvo'>No Chat is Selected</span>)}
    </div>
  )
}

export default Members