import React from 'react'
import ProfileModal from '../ProfileModal/ProfileModal';
import "./navbar.scss"

const Navbar = () => {

  const user = JSON.parse(localStorage.getItem('user'))

  const [profile, setProfile] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  }

  const handleProfile = () => {
    setProfile(!profile);
  }

  return (
    <div className='navbar'>
      <div className="profile">
        <img src={user.pic} alt="avatar" className='avatar' onMouseOver={handleProfile} />
        <p>{user.username}</p>
        <img src="https://img.icons8.com/ios/50/000000/appointment-reminders--v1.png" alt='notification' style={{ marginRight: '30px', height: '40px', cursor: 'pointer' }} />
      </div>
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