import React from 'react'
import { Avatar, Box, HStack, Text } from 'native-base'
import { TouchableOpacity } from 'react-native'

const Conversation = ({ chat, user }) => {
    const [friends, setFriends] = React.useState([]);

    React.useEffect(() => {
        setFriends((chat?.users.find(member => member._id !== user._id)))
    }, [chat, friends])

    return (
        <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
            <HStack space={[2, 3]} justifyContent="space-between" >
                <HStack alignItems={'center'}>
                    {chat && <Avatar size="48px" source={{
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
            </HStack>
        </Box>

    )
}

export default Conversation