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
} from '@chakra-ui/react';
import ProfileModal from '../UserModals/ProfileModal';
import { backend_url } from '../../baseApi';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import UserCard from '../UserItems/UserCard';
import GroupCard from '../Groups/GroupCard';

const Header = () => {
	const [toggleProfiledd, setToggleProfiledd] = useState(false)
	const { dispatch } = useContext(AppContext);

	const user = JSON.parse(localStorage.getItem('user'));
	const [search, setSearch] = useState('');
	const [searching, setSearching] = useState(false)
	const [searchResults, setSearchResults] = useState()	
	const [activeTab, setActiveTab] = useState(1)

	const location = useLocation();
	let navigate = useNavigate();

	const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";

	const handleLogout = () => {
		localStorage.removeItem('user');
		navigate('/');
		window.location.reload();
	}

	const handleSearchRoute = () => {
		if (location.pathname !== '/search') {
			navigate('/search');
		}
	}

	const handleSearch = async (e) => {
		setSearching(true)
		console.log('.......')
		setSearch(e.target.value);
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get(
				`${backend_url}/users?search=${search}`,
				config
			);
			console.log(data, "groups", "users", "events")
			setSearchResults(data)
			setSearching(false)
			dispatch({
				type: "SET_SEARCH_RESULTS",
				payload: data,
			});
		} catch (error) {
			console.log(error)
			setSearching(false)
		}
	};

	return (
		<>
			<Box className='header' zIndex='9' position='fixed' right='30px' left='290px' boxShadow={'Base'} bg={'white'} p={'20px'} borderRadius={'10px'}>
				<Flex alignItems='center'>
					<Box className='logo-header' display='none'>
						<Image height='35px' mx='auto' src={CDN_IMAGES + "/chatapp-logo.png"} alt="ChatApp" />
					</Box>
					<Box position='relative' mx='auto' minW={'400px'}>
						<Input onMouseEnter={handleSearchRoute} onChange={handleSearch} value={search} placeholder='Search Users / Groups / Events' py={'13px'} px={'21px'} bg={'#F4F1FF'} border={'0'} />
						{
							searching && (
								<Box zIndex='1' position='absolute' top='2px' right='12px'>
									<Image opacity='0.8' h='35px' src="https://ik.imagekit.io/sahildhingra/search-loading.svg" />
								</Box>
							)
						}
						<Box px='20px' background='#fff' boxShadow='0px 3px 24px rgba(159, 133, 247, 0.6)' borderRadius='5px' w='100%' position='absolute' top='calc(100% + 10px)' zIndex='1'>
							{
								searchResults?.user?.length || searchResults?.groups?.length || searchResults?.events?.length ? (
									<>
									<UnorderedList ms='0' display='flex' className="tab-nav">
										{
											searchResults?.users?.length && (
												<ListItem mr='0!important' onClick={() =>setActiveTab(1)} className={activeTab===1 ? "active" : ""}>
													Users
												</ListItem>
											)
										}
										{
											searchResults?.groups?.length && (
												<ListItem mr='0!important' onClick={() =>setActiveTab(2)} className={activeTab===2 ? "active" : ""}>
													Groups
												</ListItem>
											)
										}
										{
											searchResults?.events?.length && (
												<ListItem mr='0!important' onClick={() =>setActiveTab(3)} className={activeTab===3 ? "active" : ""}>
													Events
												</ListItem>
											)
										}
									</UnorderedList>
									<div className="tab-content">
										<div className={"tab-content-item "+(activeTab===1 ? "current" : "")}>
											{
												searchResults?.users?.map((item) => {
													return (
														<UserCard profileImg={item.pic} userName={item.username} />
													);
												})
											}
										</div>
										<div className={"tab-themes tab-content-item "+(activeTab===2 ? "current" : "")}>
											{
												searchResults?.groups?.map((item) => {
													return (
														<UserCard name={item.users.length+' Members'} profileImg={item.pic} userName={item.chatName} />
													);
												})
											}
										</div>
										<div className={"tab-content-item "+(activeTab===3 ? "current" : "")}>
											{
												searchResults?.events?.map((item) => {
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
							<Box position='relative'>
								<Image height='25px' src={CDN_IMAGES + "/notification.png"} />
							</Box>
							<Box position='relative'>
								<Button onClick={() => setToggleProfiledd(!toggleProfiledd)} className='btn-default' ms='15px' display='flex' alignItems='center' bg='transparent'>
									<Image borderRadius='full' boxSize='40px' src={user.pic} alt='Profile Pic' />
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