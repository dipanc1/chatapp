import React from 'react'
import { Box, HStack, Text, Heading, VStack } from 'native-base'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { TouchableOpacity, Image } from 'react-native';
import { checkFileExtension, typeArray } from '../../utils';

const Conversation = ({ chat, navigation }) => {
    const { userInfo, dispatch } = React.useContext(PhoneAppContext);
    const [read, setRead] = React.useState(true);
    const [friends, setFriends] = React.useState([]);

    React.useEffect(() => {
        setFriends((chat?.users.find(member => member._id !== userInfo?._id)))
    }, [chat, friends])

    return (
        <TouchableOpacity onPress={() => {
            dispatch({ type: 'SET_SELECTED_CHAT', payload: chat })
            navigation.getParent()?.setOptions({ tabBarVisible: false })
            setRead(false)
        }}>

            <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
                <HStack space={[2, 3]} justifyContent="space-between" alignItems={'center'}>
                    <HStack alignItems={'center'}>
                        {chat && <>
                            <Image
                                source={{
                                    uri: friends.pic
                                }}
                                alt={friends?.username}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 100,
                                    alignSelf: "center"
                                }}
                            />
                        </>
                        }
                        <VStack>
                            <Heading size={'sm'} ml={'3'} _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" bold>
                                {chat && friends?.username}
                            </Heading>
                            {chat && chat.latestMessage
                                && <Text mx={'3'} _dark={{
                                    color: "warmGray.50"
                                }} color="coolGray.800">
                                    {chat
                                        && chat.latestMessage
                                        && chat.latestMessage.sender
                                        && chat.latestMessage.sender._id === userInfo?._id
                                        ? 'You' :
                                        friends?.username}:
                                    {chat
                                        && chat.latestMessage
                                        &&
                                        typeArray.includes(checkFileExtension(chat.latestMessage.content))
                                        ? " " + checkFileExtension(chat.latestMessage.content)
                                        : chat.latestMessage.content}
                                </Text>}
                        </VStack>
                    </HStack>
                    {chat && chat.latestMessage && chat.latestMessage.sender && chat.latestMessage.sender._id !== userInfo?._id && !chat?.latestMessage.readBy.includes(userInfo?._id) && read && <Box
                        ml='auto'
                        w='10px'
                        h='10px'
                        borderRadius={'full'}
                        bg='red.500'
                    >
                    </Box>}
                </HStack>
            </Box>
        </TouchableOpacity>

    )
}

export default Conversation