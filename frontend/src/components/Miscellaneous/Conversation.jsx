import { useContext, useEffect, useState } from 'react'
import {
  Box,
  Text,
  Avatar,
  Heading,
  VStack
} from '@chakra-ui/react'
import { AppContext } from '../../context/AppContext';

const Conversation = ({ chat, read }) => {
  const [friends, setFriends] = useState([]);
  const { userInfo } = useContext(AppContext);

  useEffect(() => {
    setFriends((chat.users.find(member => member._id !== userInfo?._id)))
  }, [chat, friends, userInfo?._id])

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
      <VStack alignItems={'flex-start'}>
        <Heading variants={item} fontSize='md'>{chat && friends?.username}</Heading>
        <Text variants={item} fontSize='sm' ml='auto'>{chat?.latestMessage.sender._id === userInfo?._id ? 'You' : friends?.username}: {chat && chat?.latestMessage.content}</Text>
      </VStack>
      {chat?.latestMessage.sender._id !== userInfo?._id && !chat?.latestMessage.readBy.includes(userInfo?._id) && read && <Box
        ml='auto'
        w='10px'
        h='10px'
        borderRadius='50%'
        bg='red.500'
      >
      </Box>}


    </Box>
  )
}

export default Conversation 