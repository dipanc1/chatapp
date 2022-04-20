import { useState } from 'react';
import './profileModal.scss'

const ProfileModal = ({ user, children, p }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        p(false);
    }

    return (
        <>
            {
                children ?
                    <span onClick={() => setShow(true)}>{children}</span> :
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/visible--v1.png" alt='show' onClick={() => setShow(true)} style={{ cursor: "pointer" }} />
            }
            {show &&
                <div className='profileModal'>
                    <div className="profileModalContainer">
                        <h1 className='modalUserName'>{user.username}</h1>
                        <img src={user.pic} alt="user_image" className='modalUserImage' />
                        <p className='modalUserText'>Phone Number: {user.number}</p>
                        <button className='modalUserButton' onClick={handleClose}>
                            <span>
                                Close
                            </span>
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default ProfileModal