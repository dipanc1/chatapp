import React from 'react'
import { Avatar, Box, HStack, Text } from 'native-base'

const UserListItem = ({ user }) => {

    return (
        <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
            <HStack space={[2, 3]} justifyContent="space-between" >
                <HStack alignItems={'center'}>
                    <Avatar size="48px" source={{
                        uri: user?.pic
                    }}>
                    </Avatar>
                    <Text mx={'3'} _dark={{
                        color: "warmGray.50"
                    }} color="coolGray.800" bold>
                        {user?.username}
                    </Text>
                </HStack>
            </HStack>
        </Box>

    )
}

export default UserListItem