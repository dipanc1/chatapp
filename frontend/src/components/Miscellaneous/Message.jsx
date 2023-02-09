import { format } from 'timeago.js'
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Avatar, Box, Text } from '@chakra-ui/react';

const Message = ({ messages, own, sameSender, sameTime }) => {
    const { selectedChat } = useContext(AppContext);
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
                        : 
                        <div style={{ width: '2.5rem' }}></div>
                        }
                    <Box p={2} borderRadius={'6px'} bg={own ? '#9F85F7' : '#F6F3FF'}>
                        <Text color={own ? 'white' : ''}>{messages.content}</Text>
                    </Box>
                </Box>
                {sameTime ?
                    null
                    :
                    <Text ml={'10'} fontSize={'xs'}>
                        {format(messages.createdAt)}
                    </Text>
                }
            </Box>
        ) : null
    )
}

export default Message