import React from 'react'
import { Avatar, Box, HStack, Text } from 'native-base'

const GroupListItem = ({ group }) => {
    return (
            <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
                <HStack space={[3, 3]} justifyContent="space-between" >
                    <Text mx={'3'} _dark={{
                        color: "warmGray.50"
                    }} color="coolGray.800" bold>
                        {group?.chatName}
                    </Text>
                </HStack>
            </Box>

    )
}

export default GroupListItem