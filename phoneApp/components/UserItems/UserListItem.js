import React from 'react'
import { Avatar, Box, HStack, Text } from 'native-base'
import { TouchableOpacity } from 'react-native'

const UserListItem = ({ item }) => {
    return (
        <TouchableOpacity>
            <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
                <HStack space={[2, 3]} justifyContent="space-between" >
                    <HStack alignItems={'center'}>
                        {item?.avatarUrl ? <Avatar size="48px" source={{
                            uri: item?.avatarUrl
                        }}>
                            <Avatar.Badge bg="green.500" />
                        </Avatar> : null}
                        <Text mx={'3'} _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" bold>
                            {item?.fullName}
                        </Text>
                    </HStack>
                </HStack>
            </Box>
        </TouchableOpacity>

    )
}

export default UserListItem