import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import './conversation.scss'
import {
  Box,
  Text,
  Avatar
} from '@chakra-ui/react'

const Conversation = ({ chat }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  // const [loggedUser, setLoggedUser] = useState();
  // const selectedChat = useContext(PhoneNumberContext);
  // const { dispatch } = useContext(PhoneNumberContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // console.log(chat.users.find(member => member._id !== user._id));
    setFriends((chat.users.find(member => member._id !== user._id)))
    // console.log(friends);
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
      justifyContent={'space-around'}
      alignItems={'center'}
    >
      <Avatar variants={item} name={chat && friends?.username} src={chat && friends?.pic} />
      <Text variants={item} fontSize='md'>{chat && friends?.username}</Text>
    </Box>
  )
}

export default Conversation 