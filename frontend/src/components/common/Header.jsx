import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Image,
    Text,
    Button,
    Flex,
    Input,
    MenuList,
    MenuItem,
    Menu,
    UnorderedList,
    ListItem,
    Link,
    MenuButton,
    Portal,
    useToast,
    useColorMode,
} from '@chakra-ui/react';
import ProfileModal from '../UserModals/ProfileModal';
import { AppContext } from '../../context/AppContext';
import UserCard from '../UserItems/UserCard';
import conversationApi from '../../services/apis/conversationApi';
import authApi from '../../services/apis/authApi';
import PostModal from '../UserModals/PostModal';
import Cookies from 'universal-cookie';

const Header = ({
    toggleSidebar,
    setToggleSidebar,
    fetchAgain,
    setFetchAgain,
}) => {
    const cookies = new Cookies();
    const user =
        JSON.parse(localStorage.getItem('user')) ||
        cookies.get(
            'auth_token',
            { domain: '.fundsdome.com' || 'localhost' },
            { path: '/' },
        );
    const {
        dispatch,
        loading,
        notification,
        pushNotification,
        userInfo,
        selectedChat,
    } = useContext(AppContext);

    const [toggleProfiledd, setToggleProfiledd] = useState(false);
    const [toggleSearch, setToggleSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResultsUsers, setSearchResultsUsers] = useState([]);
    const [searchResultsGroups, setSearchResultsGroups] = useState([]);
    const [searchResultsEvents, setSearchResultsEvents] = useState([]);
    const [activeTab, setActiveTab] = useState(1);

    const { colorMode } = useColorMode();

    const admin =
        selectedChat?.isGroupChat &&
        selectedChat?.groupAdmin._id === userInfo?._id;

    let navigate = useNavigate();
    let location = useLocation();
    const toast = useToast();

    const CDN_IMAGES = 'https://ik.imagekit.io/sahildhingra';

    const handleLogout = () => {
        localStorage.removeItem('user');
        cookies.remove('auth_token', {
            domain: '.fundsdome.com' || 'localhost',
            path: '/',
        });
        dispatch({ type: 'SET_USER', payload: null });
        window.location.reload();
        navigate('/');
    };

    const handleSearch = async (e) => {
        setSearching(true);
        setSearch(e.target.value);
        if (e.target.value === '' || e.target.value === null) {
            setSearching(false);
            setSearchResultsUsers([]);
            setSearchResultsGroups([]);
            setSearchResultsEvents([]);
            return;
        }
        setSearching(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await authApi.searchUser(e.target.value, config);
            setSearchResultsUsers(data.users);
            setSearchResultsGroups(data.groups);
            setSearchResultsEvents(data.events);
            setSearching(false);
        } catch (error) {
            // console.log(error)
            setSearching(false);
        }
    };

    const accessChat = async (userId) => {
        // console.log(userId);
        setToggleSearch(false);
        setSearchResultsUsers([]);
        setSearchResultsGroups([]);
        setSearchResultsEvents([]);
        try {
            setSearching(true);
            dispatch({ type: 'SET_LOADING', payload: true });
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await conversationApi.accessConversation(
                { userId },
                config,
            );

            if (location.pathname !== '/video-chat') {
                navigate('/video-chat');
            }

            dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
            // console.log(data);
            setSearching(false);
            dispatch({ type: 'SET_LOADING', payload: false });
            setSearch('');
            if (fetchAgain) setFetchAgain(!fetchAgain);
        } catch (error) {
            // console.log(error)
            setSearching(false);
            dispatch({ type: 'SET_LOADING', payload: false });
            toast({
                title: 'Error Occured!',
                description: 'Failed to Load the Search Results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    const handleAddUser = async (user1, groupId) => {
        setToggleSearch(false);
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            setSearching(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await conversationApi.addToGroup(
                {
                    chatId: groupId,
                    userId: user1,
                },
                config,
            );

            // console.log(`data`, data)

            if (location.pathname !== '/video-chat') {
                navigate('/video-chat');
            }

            dispatch({ type: 'SET_SELECTED_CHAT', payload: data });

            setSearching(false);
            setSearchResultsUsers([]);
            setSearchResultsGroups([]);
            setSearchResultsEvents([]);
            if (fetchAgain) setFetchAgain(!fetchAgain);
            dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
            // console.log(error);
            toast({
                title: 'Error Occured!',
                description: 'User already exists in the group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setSearching(false);
            setSearchResultsUsers([]);
            setSearchResultsGroups([]);
            setSearchResultsEvents([]);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
        setSearch('');
    };

    return (
        <>
            <Box
                className={`header ${colorMode === 'light' ? '' : 'dark-theme'}`}
                zIndex='9'
                position='fixed'
                right={['0', '0', '30px']}
                left={['0', '0', '290px']}
                boxShadow={'Base'}
                bg={colorMode === 'light' ? 'white' : '#2b2929'}
                p={['7px 10px', '7px 10px', '20px']}
                borderRadius={['0', '0', '10px']}
            >
                <Flex alignItems='center'>
                    <Box onClick={() => setToggleSidebar(!toggleSidebar)}>
                        <Image
                            display={['block', 'block', 'none']}
                            height={['25px', '35px']}
                            mr='15px'
                            src={CDN_IMAGES + '/menu.png'}
                            alt='Menu'
                        />
                    </Box>
                    <Box className='logo-header' display='none'>
                        <Image
                            display={['none', 'none', 'block']}
                            height={['25px', '35px']}
                            mx='auto'
                            src={CDN_IMAGES + '/chatapp-logo.png'}
                            alt='ChatApp'
                        />
                        <Image
                            display={['block', 'block', 'none!important']}
                            height={['25px', '35px']}
                            mx='auto'
                            src={CDN_IMAGES + '/chatapp-logo-small.png'}
                            alt='ChatApp'
                        />
                    </Box>
                    <Box
                        transition='all 0.3s ease-in-out'
                        p={['15px 20px', '15px 20px', '0']}
                        display={['block', 'block']}
                        w={['100%', '100%', 'auto']}
                        zIndex={['1']}
                        top={['0']}
                        transform={[
                            toggleSearch ? 'unset' : 'translateY(100%)',
                            toggleSearch ? 'unset' : 'translateY(100%)',
                            'unset',
                        ]}
                        right={['0']}
                        position={['absolute', 'absolute', 'relative']}
                        height={['100vh', '100vh', 'auto']}
                        mx='auto'
                        minW={['unset', 'unset', '400px']}
                        bg='transparent'
                    >
                        <Box
                            onClick={() => setToggleSearch(false)}
                            p='10px'
                            display={['block', 'block', 'none']}
                            zIndex='2'
                            position='absolute'
                            top={['17px', '17px', '2px']}
                            left={['17px', '17px', '12px']}
                        >
                            <Image
                                opacity='0.8'
                                h='15px'
                                src={CDN_IMAGES + '/search-back.png'}
                            />
                        </Box>
                        {!userInfo?.isSuperAdmin && (
                            <Input
                                focusBorderColor='#9F85F7'
                                disabled={loading}
                                onChange={(e) => handleSearch(e)}
                                value={search}
                                placeholder='Search Users / Groups / Events'
                                py={'13px'}
                                px={['30px', '30px', '21px']}
                                bg={
                                    colorMode === 'light'
                                        ? '#F4F1FF'
                                        : '#121212'
                                }
                                border={'0'}
                            />
                        )}
                        {searching && (
                            <Box
                                zIndex='1'
                                position='absolute'
                                top={['17px', '2px']}
                                right={['30px', '12px']}
                            >
                                <Image
                                    opacity='0.8'
                                    h='35px'
                                    src='https://ik.imagekit.io/sahildhingra/search-loading.svg'
                                />
                            </Box>
                        )}
                        <Box
                            px='20px'
                            background={
                                colorMode === 'light' ? 'white' : '#1d2127'
                            }
                            boxShadow={[
                                'unset',
                                `${colorMode === 'light' ? '0px 3px 24px rgba(159, 133, 247, 0.6)' : '0px 3px 24px rgb(27 27 27 / 60%)'}`,
                            ]}
                            borderRadius='5px'
                            w='100%'
                            position='absolute'
                            top={['60px', 'calc(100% + 10px)']}
                            right={['0']}
                            zIndex='1'
                        >
                            {searchResultsUsers?.length ||
                            searchResultsGroups?.length ||
                            searchResultsEvents?.length ? (
                                <>
                                    <UnorderedList
                                        ms='0'
                                        display='flex'
                                        className='tab-nav'
                                        overflow={'hidden'}
                                    >
                                        {searchResultsUsers?.length && (
                                            <ListItem
                                                mr='0!important'
                                                onClick={() => setActiveTab(1)}
                                                className={
                                                    activeTab === 1
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                Users
                                            </ListItem>
                                        )}
                                        {searchResultsGroups?.length && (
                                            <ListItem
                                                mr='0!important'
                                                onClick={() => setActiveTab(2)}
                                                className={
                                                    activeTab === 2
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                Groups
                                            </ListItem>
                                        )}
                                        {searchResultsEvents?.length && (
                                            <ListItem
                                                mr='0!important'
                                                onClick={() => setActiveTab(3)}
                                                className={
                                                    activeTab === 3
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                Events
                                            </ListItem>
                                        )}
                                    </UnorderedList>
                                    <div className='tab-content'>
                                        <div
                                            className={
                                                'tab-content-item ' +
                                                (activeTab === 1
                                                    ? 'current'
                                                    : '')
                                            }
                                        >
                                            {searchResultsUsers?.map((item) => {
                                                return (
                                                    <div
                                                        key={item._id}
                                                        onClick={() =>
                                                            accessChat(item._id)
                                                        }
                                                    >
                                                        <UserCard
                                                            profileImg={
                                                                item.pic
                                                            }
                                                            userName={
                                                                item.username
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div
                                            className={
                                                'tab-themes tab-content-item ' +
                                                (activeTab === 2
                                                    ? 'current'
                                                    : '')
                                            }
                                        >
                                            {searchResultsGroups?.map(
                                                (item) => {
                                                    return (
                                                        <div
                                                            key={item._id}
                                                            onClick={() =>
                                                                handleAddUser(
                                                                    userInfo._id,
                                                                    item._id,
                                                                )
                                                            }
                                                        >
                                                            <UserCard
                                                                name={
                                                                    item.users
                                                                        .length +
                                                                    ' Members'
                                                                }
                                                                profileImg={
                                                                    item.pic
                                                                }
                                                                userName={
                                                                    item.chatName
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                        <div
                                            className={
                                                'tab-content-item ' +
                                                (activeTab === 3
                                                    ? 'current'
                                                    : '')
                                            }
                                        >
                                            {searchResultsEvents?.map(
                                                (item) => {
                                                    return (
                                                        <UserCard
                                                            name={item.time}
                                                            profileImg={
                                                                item.thumbnail
                                                            }
                                                            userName={item.name}
                                                        />
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                ''
                            )}
                        </Box>
                    </Box>
                    <Flex ms={['auto', 'auto', '0']}>
                        <Flex alignItems='center'>
                            <Image
                                onClick={() => setToggleSearch(true)}
                                display={['block', 'block', 'none']}
                                px='18px'
                                height='21px'
                                src={CDN_IMAGES + '/search-icon.png'}
                            />
                            <Menu>
                                <MenuButton position='relative'>
                                    {pushNotification &&
                                        notification.length > 0 && (
                                            <Text
                                                background='#9F85F7'
                                                top='-4px'
                                                borderRadius='100%'
                                                left='-3px'
                                                fontSize='10px'
                                                display='flex'
                                                alignItems='center'
                                                justifyContent='center'
                                                color='#fff'
                                                h='15px'
                                                w='15px'
                                                position='absolute'
                                            >
                                                {notification.length > 3
                                                    ? '3+'
                                                    : notification.length}
                                            </Text>
                                        )}
                                    <Image
                                        height='23px'
                                        src={CDN_IMAGES + '/notification.png'}
                                    />
                                </MenuButton>
                                <Portal>
                                    <MenuList>
                                        {!notification.length ? (
                                            <MenuItem>
                                                No new notifications
                                            </MenuItem>
                                        ) : (
                                            pushNotification &&
                                            notification.map(
                                                (notifications) => (
                                                    <MenuItem
                                                        key={notifications._id}
                                                        onClick={() => {
                                                            // console.log(notifications);
                                                            if (
                                                                location.pathname !==
                                                                '/video-chat'
                                                            ) {
                                                                navigate(
                                                                    `/video-chat`,
                                                                );
                                                            }
                                                            dispatch({
                                                                type: 'SET_SELECTED_CHAT',
                                                                payload:
                                                                    notifications.chat,
                                                            });
                                                            dispatch({
                                                                type: 'SET_NOTIFICATION',
                                                                payload:
                                                                    notification.filter(
                                                                        (
                                                                            item,
                                                                        ) =>
                                                                            item._id !==
                                                                            notifications._id,
                                                                    ),
                                                            });
                                                        }}
                                                    >
                                                        {notifications.chat
                                                            .isGroupChat
                                                            ? `New Message in ${notifications.chat.chatName}`
                                                            : `New Message from ${notifications.sender.username}`}
                                                    </MenuItem>
                                                ),
                                            )
                                        )}
                                    </MenuList>
                                </Portal>
                            </Menu>
                            <Box position='relative' ms='7px'>
                                {userInfo && (
                                    <Button
                                        onClick={() =>
                                            setToggleProfiledd(!toggleProfiledd)
                                        }
                                        className='btn-default'
                                        ms={['5px', '15px']}
                                        display='flex'
                                        alignItems='center'
                                        bg='transparent'
                                    >
                                        <Image
                                            filter={'unset!important'}
                                            borderRadius='full'
                                            objectFit='cover'
                                            boxSize={['30px', '40px']}
                                            src={userInfo.pic}
                                            alt='Profile Pic'
                                        />
                                        <Text
                                            textTransform='capitalize'
                                            fontWeight='500'
                                            display={['none', 'block']}
                                            ps='15px'
                                            pe='10px'
                                        >
                                            {userInfo?.username}
                                        </Text>
                                        <Image
                                            display={['none', 'block']}
                                            height='17px'
                                            src={CDN_IMAGES + '/down-arrow.png'}
                                            alt=''
                                        />
                                    </Button>
                                )}
                                {toggleProfiledd && (
                                    <Box
                                        className='header-dd'
                                        width='fit-content'
                                        borderRadius='4px'
                                        overflow='hidden'
                                        position='absolute'
                                        top={[
                                            'calc(100% + 10px)',
                                            'calc(100% + 20px)',
                                        ]}
                                        right='0'
                                        background={
                                            colorMode === 'light'
                                                ? 'white'
                                                : '#1d2127'
                                        }
                                        boxShadow={[
                                            'unset',
                                            `${colorMode === 'light' ? '0px 3px 24px rgba(159, 133, 247, 0.6)' : '0px 3px 24px rgb(27 27 27 / 60%)'}`,
                                        ]}
                                    >
                                        <UnorderedList
                                            listStyleType='none'
                                            p='10px 0'
                                            ms='0'
                                        >
                                            <ListItem ps='0'>
                                                <ProfileModal>
                                                    <Link
                                                        display='block'
                                                        p='5px 25px'
                                                        textDecoration='none'
                                                    >
                                                        Profile
                                                    </Link>
                                                </ProfileModal>
                                            </ListItem>
                                            {admin && (
                                                <ListItem ps='0'>
                                                    <PostModal>
                                                        <Link
                                                            display='block'
                                                            p='5px 25px'
                                                            textDecoration='none'
                                                        >
                                                            Create Post
                                                        </Link>
                                                    </PostModal>
                                                </ListItem>
                                            )}
                                            <ListItem ps='0'>
                                                <Link
                                                    onClick={handleLogout}
                                                    display='block'
                                                    p='5px 25px'
                                                    textDecoration='none'
                                                >
                                                    Logout
                                                </Link>
                                            </ListItem>
                                        </UnorderedList>
                                    </Box>
                                )}
                            </Box>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default Header;
