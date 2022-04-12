import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    const style = {
        backgroundColor: 'purple',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px',
        borderRadius: '10%',
        width: '5vw',
        margin: '0.1vw',
    }

    const style2 = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        border: '1px solid white',
        borderRadius: '50%',
        padding: '4px',
        cursor: 'pointer',
    }

    return (
        <>
            <div style={style} onClick={handleFunction}>
                <p>
                    {user.username}
                </p>
                <div style={style2} >
                    <p>X</p>
                </div>
            </div>
        </>
    )
}

export default UserBadgeItem