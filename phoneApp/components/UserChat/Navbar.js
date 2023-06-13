import React, { useState } from 'react'
import { Avatar, Box, Center, HStack, Icon, IconButton, StatusBar, Text } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileModal from '../UserModals/ProfileModal';
import NavbarModal from '../UserModals/NavbarModal';
import Searchbar from '../Miscellaneous/Searchbar';
import { PhoneAppContext } from '../../context/PhoneAppContext';


const Navbar = ({ user, fetchAgain, setFetchAgain, handleSearch, search, setSearch, navigation }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchbar, setSearchbar] = useState(false);

    const { userInfo } = React.useContext(PhoneAppContext);

    return (
        <>
            <Center>
                <StatusBar bg="primary.200" barStyle="light-content" />
                <Box safeAreaTop bg="primary.200" />
                <HStack bg="primary.200" px="3" py="3" justifyContent="space-between" alignItems="center" w="100%">
                    {!searchbar ? <Text color="black" fontSize="20" fontWeight="bold">
                        ChatApp
                    </Text> :
                        <Searchbar search={search} setSearch={setSearch} handleSearch={handleSearch} setSearchbar={setSearchbar} placeholder={"Search People or Groups"} />}
                    <HStack alignItems="center">
                        {!searchbar && <>
                            <IconButton icon={<Icon size="xl" as={MaterialIcons} name="search" color="black" />} onPress={() => setSearchbar(true)} />
                            <IconButton icon={
                                <Avatar bg="green.500" alignSelf="center" width={"32px"} height={"32px"} source={{
                                    uri: userInfo?.pic
                                }} />
                            } onPress={() => setShowModal(true)} />
                        </>
                        }
                    </HStack>
                </HStack>
            </Center>
            <NavbarModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} user={user} showModal={showModal} setShowModal={setShowModal} setModalVisible={setModalVisible} />
            <ProfileModal user={user} modalVisible={modalVisible} setModalVisible={setModalVisible} navigation={navigation} />
        </>
    )
}

export default Navbar