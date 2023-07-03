import { Avatar, Box, Text } from '@chakra-ui/react'

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
        <Box
            display={'flex'}
            flexDirection={'row'}
            px={['5px', '10px']}
            alignItems={'center'}
            initial="hidden"
            animate="visible"
            variants={list}
        >
            {/* <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />  */}
            {/* TODO: will add image later */}
            <Avatar size={['sm', 'md']} me={['10px', '15px']} variants={item} />
            <Text fontSize='md' variants={item}>{chat.chatName}</Text>
        </Box>
    )
}

export default GroupChat