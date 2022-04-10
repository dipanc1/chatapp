import React from 'react'

const UserListItem = ({ user }) => {
    return (
        <div className='conversation'>
            <img src={user.pic} alt="avatar" className='conversationImg' />
            <span className='conversationName'>{user && user.username}
            </span>
        </div>
    )
}

export default UserListItem;