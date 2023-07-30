import { format } from 'timeago.js'
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Avatar, Box, Text } from '@chakra-ui/react';
import axios from 'axios';
import { backend_url } from '../../baseApi';

const Message = ({ messages, own, sameSender, sameTime }) => {
    const { selectedChat } = useContext(AppContext);
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        const readLastMessage = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }
                await axios.post(`${backend_url}/message/read`, {
                    messageId: messages._id
                }, config)


            } catch (error) {
                console.log(error)
            }
        }

        readLastMessage()
    }, [messages, user.token])


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