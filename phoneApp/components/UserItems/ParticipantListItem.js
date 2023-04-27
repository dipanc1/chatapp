import { Avatar, Box, HStack, IconButton, Text } from 'native-base'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const ParticipantListItem = ({ user1, user, handleRemove }) => {

    return (
        <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
            <HStack space={[2, 3]} justifyContent="space-between" alignItems={'center'}>
                <HStack alignItems={'center'}>
                    <Avatar size="48px" source={{
                        uri: user1?.pic
                    }}>
                    </Avatar>
                    <Text mx={'3'} _dark={{
                        color: "warmGray.50"
                    }} color="coolGray.800" bold>
                        {user1?.username}
                    </Text>
                </HStack>
                {!(user._id === user1._id) &&
                    <IconButton
                        onPress={() => handleRemove(user1)}
                        icon={<MaterialIcons name="exit-to-app" size={24} color="#3cc4b7" />}
                        borderRadius={'lg'}
                        size={'lg'}
                        color={'#fff'}
                    />
                }
            </HStack>
        </Box>
    )
}

export default ParticipantListItem