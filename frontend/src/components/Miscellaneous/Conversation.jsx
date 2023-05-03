import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Avatar
} from '@chakra-ui/react'

const Conversation = ({ chat }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setFriends((chat.users.find(member => member._id !== user._id)))
  }, [chat, friends, user._id])

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
      initial="hidden"
      animate="visible"
      variants={list}
      display={'flex'}
      flexDirection={'row'}
      px={['5px', '10px']}
      alignItems={'center'}
    >
      <Avatar size={['sm', 'md']} me={['10px', '15px']} variants={item} name={chat && friends?.username} src={chat && friends?.pic} />
      <Text variants={item} fontSize='md'>{chat && friends?.username}</Text>
    </Box>
  )
}

export default Conversation 