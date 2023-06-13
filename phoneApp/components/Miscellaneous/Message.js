import { Avatar, Box, Flex, HStack, Text } from 'native-base'
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { format } from 'timeago.js';

const Message = ({ messages, own, sameSender, sameTime }) => {
    const { selectedChat } = React.useContext(PhoneAppContext);
    return (
        selectedChat?._id === messages?.chat._id ? <Flex>
            <HStack justifyContent={'space-between'} alignItems={'center'} >
                {sameSender && <Avatar alignSelf="center" size="md" source={{
                    uri: messages.sender.pic
                }}>
                    AJ
                </Avatar>}
                <Flex m={'5'} width={'100%'}>
                    {!sameTime && <Text marginRight={own ? '0' : '10'} marginLeft={own ? '10' : '0'} fontSize={'xs'}>{format(messages.createdAt)}</Text>}
                    <Box rounded={'lg'} p={'2'} marginRight={own ? '0' : '10'} marginLeft={own ? '10' : '0'} bg={own ? 'primary.400' : 'primary.200'}>
                        <Text style={{ color: own ? '#fff' : '#42495d' }} color={'#fff'} fontSize={'lg'}>{messages.content}</Text>
                    </Box>
                </Flex>
            </HStack>
        </Flex> : null
    )
}

export default Message