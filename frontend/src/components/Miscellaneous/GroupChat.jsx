import { Avatar, Box, Heading, Text, VStack } from '@chakra-ui/react'
import { AppContext } from '../../context/AppContext';
import { useContext, useState } from 'react';
import { checkFileExtension, typeArray } from '../../utils';
import { BellIcon } from '@chakra-ui/icons';

const GroupChat = ({ chat }) => {
    const { userInfo } = useContext(AppContext);
    const [read, setRead] = useState(true);

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
            onClick={() => setRead(false)}
        >
            {/* TODO : will add image later */}
            <Avatar size={['sm', 'md']} me={['10px', '15px']} variants={item} />
            {chat && <VStack alignItems={'flex-start'}>
                <Heading variants={item} fontSize='md'>{chat.chatName}</Heading>
                <Text variants={item} fontSize='sm' ml='auto'>
                    {chat && chat.latestMessage && chat.latestMessage.sender && chat.latestMessage.sender._id === userInfo?._id ?
                        'You' : chat && chat.latestMessage && chat.latestMessage.sender && chat.latestMessage.sender.username}
                    {chat && chat.latestMessage ? ':' : null}
                    {chat
                        && chat.latestMessage &&
                        typeArray.includes(checkFileExtension(chat.latestMessage?.content))
                        ? " " + checkFileExtension(chat.latestMessage?.content)
                        : chat.latestMessage?.content}
                </Text>
            </VStack>}
            {chat && chat.latestMessage && chat?.latestMessage.sender._id !== userInfo?._id && !chat?.latestMessage.readBy.includes(userInfo?._id) && read && <BellIcon ml='auto' color='green.500' />}
        </Box>
    )
}

export default GroupChat