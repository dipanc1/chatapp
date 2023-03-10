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

const Header = () => {
	const [toggleProfiledd, setToggleProfiledd] = useState(false)
	const { dispatch } = useContext(AppContext);

	const user = JSON.parse(localStorage.getItem('user'));
	const [search, setSearch] = useState('');
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
			dispatch({
				type: "SET_SEARCH_RESULTS",
				payload: data,
			});
		} catch (error) {
			console.log(error)
		}
	};

	return (
		<>
			<Box className='header' zIndex='9' position='fixed' right='30px' left='290px' boxShadow={'Base'} bg={'white'} p={'20px'} borderRadius={'10px'}>
				<Flex alignItems='center'>
					<Box className='logo-header' display='none'>
						<Image height='35px' mx='auto' src={CDN_IMAGES + "/chatapp-logo.png"} alt="ChatApp" />
					</Box>
					<Input onMouseEnter={handleSearchRoute} mx='auto' onChange={handleSearch} value={search} placeholder='Search Users / Groups / Events' maxW={'400px'} py={'13px'} px={'21px'} bg={'#F4F1FF'} border={'0'} />
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