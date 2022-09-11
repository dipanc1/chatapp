import React, { useState } from 'react'
import { Avatar, Box, Center, HStack, Icon, IconButton, StatusBar, Text } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileModal from '../UserModals/ProfileModal';
import NavbarModal from '../UserModals/NavbarModal';


const Navbar = ({ user, fetchAgain, setFetchAgain }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <Center>
                <StatusBar bg="primary.200" barStyle="light-content" />
                <Box safeAreaTop bg="primary.200" />
                <HStack bg="primary.200" px="3" py="3" justifyContent="space-between" alignItems="center" w="100%">
                    <Text color="black" fontSize="20" fontWeight="bold">
                        ChatApp
                    </Text>
                    <HStack alignItems="center">
                        <IconButton icon={<Icon size="xl" as={MaterialIcons} name="notifications" color="black" />} />
                        <IconButton icon={
                            <Avatar bg="green.500" alignSelf="center" size="sm" source={{
                                uri: user.pic
                            }} />
                        } onPress={() => setShowModal(true)} />
                    </HStack>
                </HStack>
            </Center>
            <NavbarModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} user={user} showModal={showModal} setShowModal={setShowModal} setModalVisible={setModalVisible} />
            <ProfileModal user={user} modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </>
    )
}

export default Navbar