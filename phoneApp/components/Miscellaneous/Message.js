import { Box, Flex, HStack, Text } from 'native-base'
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { format } from 'timeago.js';
import axios from 'axios';
import { backend_url } from '../../production';
import { Image } from 'react-native';

const Message = ({ messages, own, sameSender, sameTime, user }) => {
    const { selectedChat } = React.useContext(PhoneAppContext);

    React.useEffect(() => {
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
        selectedChat._id === messages?.chat._id ? <Flex>
            <HStack justifyContent={'space-between'} alignItems={'center'} >
                {sameSender ? <Image
                    source={{
                        uri: messages.sender.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }}
                    alt={messages.sender.username}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 100,
                        alignSelf: "center"
                    }}
                /> : <Box width={'32px'} height={'32px'}></Box>}
                
                <Flex m={'5'} width={'100%'}>
                    {!sameTime && <Text marginRight={own ? '0' : '10'} marginLeft={own ? '10' : '0'} fontSize={'xs'}>{format(new Date(messages.createdAt).valueOf())}</Text>}
                    <Box rounded={'lg'} p={'2'} marginRight={own ? '0' : '10'} marginLeft={own ? '10' : '0'} bg={own ? 'primary.400' : 'primary.200'}>
                        <Text color={own ? '#fff' : 'primary.600'} fontSize={'lg'}>{messages.content}</Text>
                    </Box>
                </Flex>
            </HStack>
        </Flex> : null
    )
}

export default Message