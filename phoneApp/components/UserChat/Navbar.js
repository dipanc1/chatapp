import React from 'react'
import { Avatar, Box, Center, HStack, Icon, IconButton, StatusBar, Text } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const Navbar = () => {
    return (
        <Center>
            <StatusBar bg="primary.200" barStyle="light-content" />
            <Box safeAreaTop bg="primary.200" />
            <HStack bg="primary.200" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
                <HStack alignItems="center">
                    <IconButton icon={<Icon size="xl" as={MaterialIcons} name="menu" color="black" />} />
                    <Text color="black" fontSize="20" fontWeight="bold">
                        ChatApp
                    </Text>
                </HStack>
                <HStack alignItems="center">
                    <IconButton icon={<Icon size="xl" as={MaterialIcons} name="notifications" color="black" />} />
                    <Avatar bg="green.500" alignSelf="center" size="sm" source={{
                        uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    }} />
                </HStack>
            </HStack>
        </Center>
    )
}

export default Navbar