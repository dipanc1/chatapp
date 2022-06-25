import './message.scss'
import { format } from 'timeago.js'
import { useContext } from 'react';
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import { Avatar, Box, Text } from '@chakra-ui/react';

const Message = ({ messages, own, sameSender, sameTime }) => {
    const { selectedChat } = useContext(PhoneNumberContext);
    // console.log(messages);
    return (
        selectedChat?._id === messages?.chat._id ? (
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={own ? 'flex-end' : ''}
                mx={3}
                my={3}
            >
                <Box display={'flex'}>
                    {sameSender ?
                        <Avatar size='sm' mr={'1.5'} name={messages.sender.username} src={messages.sender.pic} />
                        : null}
                    <Box p={2} borderRadius={'xl'} bg={own ? '#b5cbfe' : '#f3f7fc'}>
                        <Text color={own ? 'white' : ''}>{messages.content}</Text>
                    </Box>
                </Box>
                {sameTime ?
                    null
                    :
                    <Text fontSize={'xs'}>
                        {format(messages.createdAt)}
                    </Text>
                }
            </Box>
        ) : null
    )
}

export default Message