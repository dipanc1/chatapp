import { Avatar, Box, HStack, IconButton, Text } from 'native-base'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext';

const ParticipantListItem = ({ user1, admin, handleRemove, selectedChat }) => {
    const { userInfo } = React.useContext(PhoneAppContext);

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
                    <Text mx={'1'} _dark={{
                        color: "warmGray.50"
                    }} color="coolGray.800">
                        {selectedChat.groupAdmin._id === user1._id && '(Admin)'}
                    </Text>
                </HStack>
                {!(userInfo._id === user1._id) && admin &&
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