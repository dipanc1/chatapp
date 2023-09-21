import React from 'react'
import { Box, HStack, Heading, Text, VStack } from 'native-base'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { TouchableOpacity } from 'react-native';
import { checkFileExtension, typeArray } from '../../utils';

const GroupListItem = ({ group, navigation }) => {
    const { userInfo, dispatch } = React.useContext(PhoneAppContext);
    const [read, setRead] = React.useState(true);

    return (
        <TouchableOpacity
            onPress={() => {
                dispatch({ type: 'SET_SELECTED_CHAT', payload: group })
                navigation.getParent()?.setOptions({ tabBarVisible: false })
                setRead(false)
            }
            }>
            <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
                <HStack justifyContent="space-between" alignItems={'center'}>
                    <VStack mx={'3'} alignItems={'flex-start'}>
                        <Heading size={'sm'} _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" bold>
                            {group && group.chatName}
                        </Heading>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800">
                            {group && group.latestMessage && group.latestMessage.sender && group.latestMessage.sender._id === userInfo?._id ? 'You' : group && group.latestMessage && group.latestMessage.sender && group.latestMessage.sender.username}{group && group.latestMessage ? ':' : null} {group && group.latestMessage && typeArray.includes(checkFileExtension(group.latestMessage.content))
                                ? " " + checkFileExtension(group.latestMessage.content)
                                : group.latestMessage?.content}
                        </Text>
                    </VStack>
                    {group && group.latestMessage && (group.latestMessage.sender?._id !== userInfo?._id && !group.latestMessage?.readBy?.includes(userInfo?._id) && read) && <Box
                        ml='auto'
                        w='10px'
                        h='10px'
                        borderRadius='full'
                        bg='red.500'
                    >
                    </Box>}
                </HStack>
            </Box>
        </TouchableOpacity>
    )
}

export default GroupListItem