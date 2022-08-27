import { Box, Button, Flex, HStack, Icon, IconButton, Input, Text, VStack } from 'native-base'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Message from '../Miscellaneous/Message'


const Chatbox = () => {
    return (
        <Flex bg={'white'} mx={'4'} flex={'1'}>
            {/* TOP PART  */}
            <HStack justifyContent={'space-between'} alignItems={'center'} h={'16'}>
                <Text fontSize={'lg'} mx={'10'}>
                    John Doe
                </Text>
                <IconButton icon={<MaterialIcons name="keyboard-arrow-down" size={24} color={'black'} />} />
            </HStack>

            {/* MIDDLE PART */}
            <Box flex={'1'}>
                <Message />
            </Box>

            {/* BOTTOM PART */}
            <HStack alignItems={'center'} justifyContent={'space-between'} h={'16'}>
                <Input outlineColor={'primary.400'} bg={'primary.200'} w={'72'} placeholder={'Type a message'} />
                <IconButton bg={'primary.300'} icon={<MaterialIcons name="send" size={24} color={'white'} />} />
            </HStack>

        </Flex>

    )
}

export default Chatbox