import React from 'react'
import { Avatar, Box, HStack, Text, Flex } from 'native-base'
import { PhoneAppContext } from '../../context/PhoneAppContext';

const Conversation = ({ chat, user }) => {
    const { userInfo } = React.useContext(PhoneAppContext);
    const [friends, setFriends] = React.useState([]);

    React.useEffect(() => {
        setFriends((chat?.users.find(member => member._id !== userInfo?._id)))
    }, [chat, friends])

    return (
        <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
            <HStack space={[2, 3]} justifyContent="space-between" alignItems={'center'}>
                <HStack alignItems={'center'}>
                    {chat && <Avatar width={"48px"} height={"48px"} source={{
                        uri: friends?.pic
                    }}>
                        {friends?.isOnline ? <Avatar.Badge bg="green.500" /> : <Avatar.Badge bg="red.500" />}
                    </Avatar>
                    }
                    <Text mx={'3'} _dark={{
                        color: "warmGray.50"
                    }} color="coolGray.800" bold>
                        {chat && friends?.username}
                    </Text>
                </HStack>
                {/* <Flex alignItems={'center'} justifyContent={'center'} bg={'red.500'} borderRadius={'full'} width={'24px'} height={'24px'}>
                    <Text color={'muted.50'} fontSize={'xs'}>2</Text>
                </Flex> */}
            </HStack>
        </Box>

    )
}

export default Conversation