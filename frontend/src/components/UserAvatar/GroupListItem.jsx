import React from 'react'

const GroupListItem = ({group}) => {
    return (
        <div className="group-name">
            {/* <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />  */}
            {/* will add image later */}
            <p>{group.chatName}</p>
        </div>
    )
}

export default GroupListItem