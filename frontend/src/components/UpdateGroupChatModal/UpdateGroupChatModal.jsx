import React, { useState } from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {

  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat } = React.useContext(PhoneNumberContext);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleRemove = async () => {
    // try {
    //   setRenameLoading(true);
    //   const config = {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${user.token}`
    //     }
  }

  const handleRename = () => { }

  return (
    <>
      {

        <img src="https://img.icons8.com/ios-glyphs/30/000000/visible--v1.png" alt='show' onClick={() => setShow(true)} style={{ cursor: "pointer" }} />
      }
      {show &&
        <div className='profileModal'>
          <div className="profileModalContainer">
            <h1 className='modalUserName'>{selectedChat.chatName}</h1>
            <div className="badgeItem" style={{ display: 'flex', flexWrap: 'wrap' }} >
              {selectedChat.users.map(u =>
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)} />
              )}
            </div>
            <form action="">
              <div className="groupChatName">
                <input type="text" placeholder="Group Name" onChange={(e) => setGroupChatName(e.target.value)} />
              </div>
              <div className="rename">
                <button
                  type="button"
                  onClick={handleRename}>
                  Update</button>
              </div>
            </form>
            <button className='modalUserButton' onClick={() => setShow(false)}>Close</button>
          </div>
        </div>
      }
    </>
  )
}

export default UpdateGroupChatModal