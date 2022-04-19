import React from 'react'
import ProfileModal from '../ProfileModal/ProfileModal';
import "./navbar.scss"
import { useHistory } from "react-router-dom";
import { PhoneNumberContext } from '../../context/phoneNumberContext';

const Navbar = () => {

  const user = JSON.parse(localStorage.getItem('user'));

  const { notification, dispatch } = React.useContext(PhoneNumberContext);
  console.log(notification);

  const [show, setShow] = React.useState(false);

  let history = useHistory();

  const [profile, setProfile] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    history.push('/');
  }

  const handleProfile = () => {
    setProfile(!profile);
  }

  const handleNotification = () => {
    setShow(!show);
  }

  return (
    <div className='navbar'>
      <div className="profile">
        <img src={user.pic} alt="avatar" className='avatar' onMouseOver={handleProfile} />
        <p>{user.username}</p>
        <img src="https://img.icons8.com/ios/50/000000/appointment-reminders--v1.png" alt='notification' style={{
          cursor: 'pointer',
          marginRight: '30px',
          height: '40px'
        }} onClick={handleNotification}/>
        {
          notification.length > 0 &&
          <div className="number" >
            <p>{notification.length}</p>
          </div>
        }
      </div>
      {show ? <div className="notificationModal">
        <ul>
          {!notification.length ? <li onClick={handleNotification}>No new notifications</li> : notification.map((notification) => {
            return (
              <>
                <li key={notification._id} onClick={()=> {
                  dispatch({
                    type: 'SET_SELECTED_CHAT',
                    payload: notification.chat
                  })
                  dispatch({
                    type: 'SET_NOTIFICATION',
                    payload: notification.filter(n => n !== notification)
                  })
                  setShow(false)
                }}>
                  {notification.chat.isGroupChat ? `New Message in ${notification.chat.chatName}` : `New Message from ${notification.sender.username}`}
                </li>
                <hr />
              </>
            )
          })}
        </ul>
      </div> : null}
      {profile ?
        <div className="myProfile">
          <ul>
            <ProfileModal user={user} >
              <li>
                My Profile
              </li>
            </ProfileModal>
            <hr />
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
        : null}
    </div>
  )
}

export default Navbar;