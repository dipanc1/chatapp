import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import { backend_url } from '../../production';
import ChatOnline from '../chatOnline/ChatOnline';
import Loading from '../Loading';
import { MembersComponent } from '../members/Members';
import UserListItem from '../UserAvatar/UserListItem';
import './detailsmodal.scss'

const DetailsModal = ({ children, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [show, setShow] = React.useState(false);
    const [groupChatName, setGroupChatName] = React.useState('');
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [renameLoading, setRenameLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false)
    const [profile, setProfile] = React.useState(null);

    const { selectedChat, dispatch } = React.useContext(PhoneNumberContext);
    const user = JSON.parse(localStorage.getItem('user'));


    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            return alert('You are not the admin of this group chat')
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${backend_url}/conversation/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? dispatch({ type: 'SET_SELECTED_CHAT', payload: '' }) : dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
            setFetchAgain(!fetchAgain);
            setLoading(false);
            alert('User removed from group chat');
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find(u => u._id === user1._id)) {
            alert("user already in chat")
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            alert("you are not the admin")
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${backend_url}/conversation/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
            console.log(data);
            dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        setSearch('');

    }

    const handleRename = async () => {
        if (!groupChatName) {
            return
        }

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const body = {
                chatName: groupChatName,
                chatId: selectedChat._id
            }
            const { data } = await axios.put(`${backend_url}/conversation/rename`, body, config)
            dispatch({ type: 'SET_SELECTED_CHAT', payload: data })
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            setGroupChatName('');
        } catch (err) {
            console.log(err)
            setRenameLoading(false);
        }
    }

    const handleSearch = async (e) => {
        setSearch(e.target.value);
        setLoading(true);
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
            setSearchResults(data.users);
            console.log(searchResults);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        children ?
            <span onClick={onOpen}>{children}</span> :
            <>
                <IconButton
                    aria-label='View Profile'
                    size='md'
                    onClick={onOpen}
                    icon={<ViewIcon />}
                />

                <Modal
                    size={['xs', 'md', 'md', 'md']}
                    isCentered
                    onClose={onClose}
                    isOpen={isOpen}
                    motionPreset='slideInBottom'
                >
                    <ModalOverlay />
                    <ModalContent
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        borderRadius={'lg'}
                        border={'1px solid #eaeaea'}
                        boxShadow={'lg'}
                    >

                        <MembersComponent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    </ModalContent>

                </Modal>
            </>

    )
}

export default DetailsModal