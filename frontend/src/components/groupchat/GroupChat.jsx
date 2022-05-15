import './groupChat.scss'
import { motion } from 'framer-motion'

const GroupChat = ({ chat }) => {
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
        <motion.div className="group-name"
            initial="hidden"
            animate="visible"
            variants={list}
        >
            {/* <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />  */}
            {/* will add image later */}

            <p variants={item}>{chat.chatName}</p>
        </motion.div>
    )
}

export default GroupChat