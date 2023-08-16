import React from 'react'
import { Box, HStack, Text } from 'native-base'
import { Image } from 'react-native';

const UserListItem = ({ user }) => {

    return (
        <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
            <HStack space={[2, 3]} justifyContent="space-between" >
                <HStack alignItems={'center'}>
                    <Image
                        source={{
                            uri: user?.pic
                        }}
                        alt={user?.username}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 100,
                            alignSelf: "center"
                        }}
                    />
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