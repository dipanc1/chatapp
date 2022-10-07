import axios from 'axios';
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { backend_url } from '../../baseApi';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Spinner,
    Box,
    IconButton
} from "@chakra-ui/react";
import {
    ViewIcon
} from '@chakra-ui/icons'
import UserBadgeItem from '../UserItems/UserBadgeItem';
import UserListItem from '../UserItems/UserListItem';


const GroupChatModal = ({ children, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = JSON.parse(localStorage.getItem('user'))
    const { dispatch, chats } = useContext(AppContext);
    const toast = useToast();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
            // console.log(data.users);
            setLoading(false);
            setSearchResults(data.users);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const handleSubmit = async (e) => {
        if (!groupChatName || !selectedUsers.length) {
            toast({
                title: "Please enter a group chat name and select at least one user",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        e.preventDefault();
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`${backend_url}/conversation/group`, { name: groupChatName, users: JSON.stringify(selectedUsers.map(u => u._id)) }, config);

            if (!chats.find(chat => chat._id === data._id)) {
                dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
            }

            setFetchAgain(!fetchAgain);
            setLoading(false);
            setSearch('');
            onClose();
            setGroupChatName('');
            setSelectedUsers([]);
            setSearchResults([]);
            toast({
                title: "New Group Chat Created Successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            setFetchAgain(!fetchAgain);
            setLoading(false);
            setSearch('');
            setSelectedUsers([]);
            setSearchResults([]);
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id))
    }

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
                )}
            <Modal size={['xs', 'xs', 'xl', 'lg']} onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        d="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                focusBorderColor='#9F85F7'
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: Dipan, Abhishek, Vikram"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                                focusBorderColor='#9F85F7'
                            />
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                height={'48'}
                                justifyContent={'center'}
                            >
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='buttonPrimaryColor'
                                    size='xl'
                                />
                            </Box>
                        ) :
                            <Box
                                maxHeight={'48'}
                                overflowY={'scroll'}
                            >
                                {searchResults.map((user) => (
                                    <Box
                                        _hover={{
                                            background: '#b5cbfe',
                                            color: 'white',
                                        }}
                                        bg={'#E8E8E8'}
                                        p={2}
                                        cursor={'pointer'}
                                        my={'0.2rem'}
                                        mx={'2rem'}
                                        borderRadius="lg"
                                        key={user._id}
                                        onClick={() => handleGroup(user)}>
                                        <UserListItem user={user} />
                                    </Box>
                                ))
                                }
                            </Box>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit} color={'white'} backgroundColor={'buttonPrimaryColor'}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal