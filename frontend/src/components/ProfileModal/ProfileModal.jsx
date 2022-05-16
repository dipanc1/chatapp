import { useState } from 'react';
import './profileModal.scss'
import { motion } from 'framer-motion';

const ProfileModal = ({ user, children, p }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        p(false);
    }

    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "-100%" },
    }

    return (
        <>
            {
                children ?
                    <span onClick={() => setShow(true)}>{children}</span> :
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/visible--v1.png" alt='show' onClick={() => setShow(true)} style={{ cursor: "pointer" }} />
            }
            {show &&
                <div className='profileModal'
                >
                    <motion.div
                        animate={show ? "open" : "closed"}
                        variants={variants} className="profileModalContainer">
                        <h1 className='modalUserName'>{user.username}</h1>
                        <img src={user.pic} alt="user_image" className='modalUserImage' />
                        <p className='modalUserText'>Phone Number: {user.number}</p>
                        <motion.button
                            className='modalUserButton'
                            onClick={handleClose}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <span>
                                Close
                            </span>
                        </motion.button>
                    </motion.div>
                </div>
            }
        </>
    )
}

export default ProfileModal