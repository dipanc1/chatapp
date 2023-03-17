import React, {
	useContext,
	useState
} from 'react'
import { useLocation, useNavigate } from "react-router-dom";
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
} from '@chakra-ui/react';
import ProfileModal from '../UserModals/ProfileModal';
import { backend_url } from '../../baseApi';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import UserCard from '../UserItems/UserCard';
import useSound from 'use-sound';
import joinSound from '../../sounds/join.mp3';

const Header = ({ fetchAgain, setFetchAgain }) => {
	const user = JSON.parse(localStorage.getItem('user'));
	const { dispatch, chats, loading, notification } = useContext(AppContext);
	const [play] = useSound(joinSound);
	const [toggleProfiledd, setToggleProfiledd] = useState(false)
	const [search, setSearch] = useState('');
	const [searching, setSearching] = useState(false)
	const [searchResultsUsers, setSearchResultsUsers] = useState([]);
	const [searchResultsGroups, setSearchResultsGroups] = useState([]);
	const [searchResultsEvents, setSearchResultsEvents] = useState([]);
	const [activeTab, setActiveTab] = useState(1)

	let navigate = useNavigate();
	let location = useLocation();
	const toast = useToast();

	const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";

	const handleLogout = () => {
		localStorage.removeItem('user');
		navigate('/');
		window.location.reload();
	}

	React.useEffect(() => {
		notification.length > 0 && notification.length < 3 && play()

	}, [notification.length, play])


	const handleSearch = async (e) => {
		setSearching(true)
		setSearch(e.target.value);
		if (e.target.value === '' || e.target.value === null) {
			setSearching(false)
			setSearchResultsUsers([]);
			setSearchResultsGroups([]);
			setSearchResultsEvents([]);
			return;
		}
		setSearching(true)
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get(
				`${backend_url}/users?search=${e.target.value}`,
				config
			);
			setSearchResultsUsers(data.users);
			setSearchResultsGroups(data.groups);
			setSearchResultsEvents(data.events);
			setSearching(false)
		} catch (error) {
			console.log(error)
			setSearching(false)
		}
	};

	const accessChat = async (userId) => {
		// console.log(userId);
		setSearchResultsUsers([]);
		setSearchResultsGroups([]);
		setSearchResultsEvents([]);
		try {
			setSearching(true);
			dispatch({ type: "SET_LOADING", payload: true });
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post(
				`${backend_url}/conversation`,
				{ userId },
				config
			);

			if (location.pathname !== "/video-chat") {
				navigate("/video-chat");
			}

			dispatch({ type: "SET_SELECTED_CHAT", payload: data });
			// console.log(data);
			setSearching(false);
			dispatch({ type: "SET_LOADING", payload: false });
			setSearch("");
			if (fetchAgain) setFetchAgain(!fetchAgain);
		} catch (error) {
			// console.log(error)
			setSearching(false);
			dispatch({ type: "SET_LOADING", payload: false });
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Search Results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	// fetch all conversations
	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get(
				`${backend_url}/conversation`,
				config
			);

			dispatch({ type: "SET_CONVERSATIONS", payload: data });
			dispatch({ type: "SET_GROUP_CONVERSATIONS", payload: data });

			if (
				!chats.find(
					(chat) => chat._id === data.map((datas) => datas._id)
				)
			) {
				dispatch({ type: "SET_CHATS", payload: data });
			}
		} catch (error) {
			// console.log(error)
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Conversations",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
		setSearchResultsUsers([]);
		setSearchResultsGroups([]);
		setSearchResultsEvents([]);
	};

	const handleAddUser = async (user1, groupId) => {
		try {
			dispatch({ type: "SET_LOADING", payload: true });
			setSearching(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.put(
				`${backend_url}/conversation/groupadd`,
				{
					chatId: groupId,
					userId: user1,
				},
				config
			);

			// console.log(`data`, data)

			if (location.pathname !== "/video-chat") {
				navigate("/video-chat");
			}

			dispatch({ type: "SET_SELECTED_CHAT", payload: data });
			
			setSearching(false);
			setSearchResultsUsers([]);
			setSearchResultsGroups([]);
			setSearchResultsEvents([]);
			if (fetchAgain) setFetchAgain(!fetchAgain);
			dispatch({ type: "SET_LOADING", payload: false });
		} catch (error) {
			// console.log(error);
			toast({
				title: "Error Occured!",
				description: "User already exists in the group",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
			setSearching(false);
			setSearchResultsUsers([]);
			setSearchResultsGroups([]);
			setSearchResultsEvents([]);
			dispatch({ type: "SET_LOADING", payload: false });
		}
		setSearch("");
	};

	React.useEffect(() => {
		fetchChats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAgain]);

	return (
		<>
			{console.log(user, "<---")}
			<Box className='header' zIndex='9' position='fixed' right='30px' left='290px' boxShadow={'Base'} bg={'white'} p={'20px'} borderRadius={'10px'}>
				<Flex alignItems='center'>
					<Box className='logo-header' display='none'>
						<Image height='35px' mx='auto' src={CDN_IMAGES + "/chatapp-logo.png"} alt="ChatApp" />
					</Box>
					<Box position='relative' mx='auto' minW={'400px'}>
						<Input disabled={loading} onChange={(e) => handleSearch(e)} value={search} placeholder='Search Users / Groups / Events' py={'13px'} px={'21px'} bg={'#F4F1FF'} border={'0'} />
						{
							searching && (
								<Box zIndex='1' position='absolute' top='2px' right='12px'>
									<Image opacity='0.8' h='35px' src="https://ik.imagekit.io/sahildhingra/search-loading.svg" />
								</Box>
							)
						}
						<Box px='20px' background='#fff' boxShadow='0px 3px 24px rgba(159, 133, 247, 0.6)' borderRadius='5px' w='100%' position='absolute' top='calc(100% + 10px)' zIndex='1'>
							{
								searchResultsUsers?.length || searchResultsGroups?.length || searchResultsEvents?.length ? (
									<>
										<UnorderedList ms='0' display='flex' className="tab-nav">
											{
												searchResultsUsers?.length && (
													<ListItem mr='0!important' onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
														Users
													</ListItem>
												)
											}
											{
												searchResultsGroups?.length && (
													<ListItem mr='0!important' onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
														Groups
													</ListItem>
												)
											}
											{
												searchResultsEvents?.length && (
													<ListItem mr='0!important' onClick={() => setActiveTab(3)} className={activeTab === 3 ? "active" : ""}>
														Events
													</ListItem>
												)
											}
										</UnorderedList>
										<div className="tab-content">
											<div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>
												{
													searchResultsUsers?.map((item) => {
														return (
															<div key={item._id}
																onClick={() => accessChat(item._id)}>

																<UserCard profileImg={item.pic} userName={item.username} />
															</div>
														);
													})
												}
											</div>
											<div className={"tab-themes tab-content-item " + (activeTab === 2 ? "current" : "")}>
												{
													searchResultsGroups?.map((item) => {
														return (
															<div key={item._id}
																onClick={() =>
																	handleAddUser(user._id, item._id)
																}>

																<UserCard name={item.users.length + ' Members'} profileImg={item.pic} userName={item.chatName} />
															</div>
														);
													})
												}
											</div>
											<div className={"tab-content-item " + (activeTab === 3 ? "current" : "")}>
												{
													searchResultsEvents?.map((item) => {
														return (
															<UserCard name={item.time} profileImg={item.thumbnail} userName={item.name} />
														);
													})
												}
											</div>
										</div>
									</>
								) : ('')
							}
						</Box>
					</Box>
					<Flex>
						<Flex alignItems='center'>
							<Link href='/video-chat'>
								<Image height='23px' me='20px' src={CDN_IMAGES + "/messages.png"} />
							</Link>
							<Menu>
								<MenuButton position='relative'>
									{
										notification.length > 0 && (
											<Text background='#9F85F7' top='-4px' borderRadius='100%' left='-3px' fontSize='10px' display='flex' alignItems='center' justifyContent='center' color='#fff' h='15px' w='15px' position="absolute">{notification.length > 3 ? "3+" : notification.length}</Text>
										)
									}
									<Image height='23px' src={CDN_IMAGES + "/notification.png"} />
								</MenuButton>
								<Portal>
									<MenuList>
										{!notification.length
											? <MenuItem>No new notifications</MenuItem>
											:
											notification.map((notifications) =>
												<MenuItem
													key={notifications._id}
													onClick={() => {
														// console.log(notifications);
														dispatch({
															type: 'SET_SELECTED_CHAT',
															payload: notifications.chat
														})
														dispatch({
															type: 'SET_NOTIFICATION',
															payload: notification.filter((item) => item._id !== notifications._id)
														})
													}}>
													{notifications.chat.isGroupChat ? `New Message in ${notifications.chat.chatName}` : `New Message from ${notifications.sender.username}`}
												</MenuItem>
											)}
									</MenuList>
								</Portal>
							</Menu>
							<Box position='relative' ms='7px'>
								<Button onClick={() => setToggleProfiledd(!toggleProfiledd)} className='btn-default' ms='15px' display='flex' alignItems='center' bg='transparent'>
									<Image borderRadius='full' objectFit='cover' boxSize='40px' src={user.pic} alt='Profile Pic' />
									<Text ps='15px' pe='10px'>
										{user.username}
									</Text>
									<Image height='17px' src={CDN_IMAGES + "/down-arrow.png"} alt='' />
								</Button>
								{
									toggleProfiledd && (
										<Box className='header-dd' width='100%' borderRadius='4px' overflow='hidden' position='absolute' top='calc(100% + 20px)' right='0' background='#fff' boxShadow='0px 3px 24px rgb(159 133 247 / 60%)'>
											<UnorderedList listStyleType='none' p='10px 0' ms='0'>
												<ListItem ps='0'>
													<ProfileModal user={user}>
														<Link display='block' p='5px 25px' textDecoration='none'>Profile</Link>
													</ProfileModal>
												</ListItem>
												<ListItem ps='0'>
													<Link onClick={handleLogout} display='block' p='5px 25px' textDecoration='none'>Logout</Link>
												</ListItem>
											</UnorderedList>
										</Box>
									)
								}

							</Box>
						</Flex>
					</Flex>
				</Flex>
			</Box>
		</>
	)
}

export default Header