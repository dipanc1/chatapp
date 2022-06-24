import React from 'react'
import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user }) => {
    return (
        <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-around'}
            alignItems={'center'}
        >
            <Avatar
                cursor="pointer"
                name={user.username}
                src={user.pic}
            />
            <Box>
                <Text>{user.username}</Text>
            </Box>
        </Box>
    )
}

export default UserListItem;