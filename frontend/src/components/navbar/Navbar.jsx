import React, { useEffect } from 'react'
import ProfileModal from '../ProfileModal/ProfileModal';
import "./navbar.scss"
import { useHistory } from "react-router-dom";
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import {  motion } from 'framer-motion';

const Navbar = () => {

  const [transformmm, setTransformmm] = React.useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const { notification, dispatch, mobile } = React.useContext(PhoneNumberContext);
  // console.log(notification);

  const [show, setShow] = React.useState(false);

  let history = useHistory();

  const [profile, setProfile] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (show) {
        setShow(!show);
      }
    }, 10000);
  }, [show])


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

  const list = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  }

  const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
  }

  return (
    <div className='navbar'>
      {mobile ?
        <img
          src="https://img.icons8.com/material-outlined/24/000000/menu--v1.png" alt='menu1' className='menu' onClick={() => dispatch({ type: 'SET_MOBILE' })} />
        :
        <img
          src="https://img.icons8.com/ios/50/000000/delete-sign--v1.png" alt='menu1' className='menu' onClick={() => dispatch({ type: 'SET_MOBILE' })} />
      }
      <div className="profile">
        <img src={user.pic} alt="avatar" className='avatar' onClick={handleProfile} />
        <p>{user.username}</p>
        <img src="https://img.icons8.com/ios/50/000000/appointment-reminders--v1.png" alt='notification' style={{
          transform: transformmm ? 'scale(1.1) translateY(-2px)' : null,
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
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={list}
        >
          {!notification.length ? <li onClick={handleNotification}>No new notifications</li> : notification.map((notifications) => {
            return (
              <>
                <li
                  variants={item}
                  key={notifications._id}
                  onClick={() => {
                    console.log(notifications);
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
        </motion.ul>
      </div> : null}
      {profile ?
        <div className="myProfile">
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={list}
          >
            <ProfileModal user={user} p={setProfile}>
              <li
                variants={item}>
                My Profile
              </li>
            </ProfileModal>
            <hr />
            <li
              variants={item}
              onClick={handleLogout}
            >Logout</li>
          </motion.ul>
        </div>
        : null}
    </div>
  )
}

export default Navbar;