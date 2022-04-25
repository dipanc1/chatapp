import React, { useEffect } from 'react'
import ProfileModal from '../ProfileModal/ProfileModal';
import "./navbar.scss"
import { useHistory } from "react-router-dom";
import { PhoneNumberContext } from '../../context/phoneNumberContext';

const Navbar = () => {

  const [transformmm, setTransformmm] = React.useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const { notification, dispatch } = React.useContext(PhoneNumberContext);
  // console.log(notification);

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
        <img src={user.pic} alt="avatar" className='avatar' onClick={handleProfile} />
        <p>{user.username}</p>
        <img src="https://img.icons8.com/ios/50/000000/appointment-reminders--v1.png" alt='notification' style={{
          transform: transformmm ? 'scale(1.1) translateY(-2px)' :  null,
          transition: 'all 0.1s ease-in-out',
          cursor: 'pointer',
          marginRight: '30px',
          height: '40px',
        }}
          onClick={handleNotification} 
          onMouseEnter={() => setTransformmm(true)}
          onMouseLeave={() => setTransformmm(false)}
          />
        {
          notification?.length > 0 &&
          <div className="number" >
            <p>{notification?.length}</p>
          </div>
        }
      </div>
      {show ? <div className="notificationModal">
        <ul>
          {!notification.length ? <li onClick={handleNotification}>No new notifications</li> : notification.map((notifications) => {
            return (
              <>
                <li key={notifications._id} onClick={() => {
                  // console.log(notifications);
                  // console.log(notifications._id !== notification[0]._id);
                  setShow(!show);
                  dispatch({
                    type: 'SET_SELECTED_CHAT',
                    payload: notifications.chat
                  })
                  dispatch({
                    type: 'SET_NOTIFICATION',
                    payload: notifications.filter(notifications._id !== notification._id)
                  })

                  //check this feature
                }}>
                  {notifications.chat.isGroupChat ? `New Message in ${notifications.chat.chatName}` : `New Message from ${notifications.sender.username}`}
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
            <ProfileModal user={user} p={setProfile}>
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