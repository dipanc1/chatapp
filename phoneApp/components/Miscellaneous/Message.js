import { Avatar, Box, Flex, HStack, Text } from 'native-base'
import React from 'react'

const Message = () => {
    return (
        <Flex>
            <HStack justifyContent={'space-between'} alignItems={'center'} >
                <Avatar alignSelf="center" size="md" source={{
                    uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                }}>
                    AJ
                </Avatar>
                <Flex m={'5'} width={'100%'}>
                    <Text fontSize={'xs'}>gregeg</Text>
                    <Box rounded={'lg'} p={'2'} bg={'primary.100'}>
                        <Text fontSize={'lg'}>lorem trjejitniujntreuni</Text>
                    </Box>
                </Flex>
            </HStack>
        </Flex>
    )
}

export default Message