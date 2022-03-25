import React from 'react'
import "./navbar.scss"

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="profile">
            <img src="https://via.placeholder.com/150" alt="avatar" className='avatar' />
            <p>John Doe</p>
        </div>
    </div>
  )
}

export default Navbar