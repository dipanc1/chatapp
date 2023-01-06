import React from 'react'
import { NavLink } from "react-router-dom";
import { 
	Box, 
	Text,
	Flex,
	List,
  ListItem,
	Image
} from '@chakra-ui/react';
import './style.css'

const sidebar = () => {

	const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";
	const NavMenu = [
		{
			'title': 'Dashboard', 
			'icon': 'dashboard'
		},
		{
			'title': 'Live Stream', 
			'icon': 'explore',
		},
		{
			'title': 'Events', 
			'icon': 'events',
		},
		{
			'title': 'Messages', 
			'icon': 'messages',
		},
		{
			'title': 'Subscription', 
			'icon': 'subscription',
		},
		{
			'title': 'Settings', 
			'icon': 'settings',
		}
	]

  return (
    <>
			<Box position='fixed' boxShadow={'Base'} bg={'white'} p={'20px'} height={'calc(100vh - 40px)'} width={'240px'} borderRadius={'10px'}>
				<Flex className='sidebar-nav' height={'100%'} flexDirection={'column'}>
					<Box pt='7px' pb='40px'>
						<Image height='35px' mx='auto' src={CDN_IMAGES+"/chatapp-logo.png"} alt="ChatApp" />
					</Box>
					<List>
						{
							NavMenu.map((navitem) => {
								return (
									<ListItem py={'4px'} fontWeight={'600'}>
										<NavLink to={"/"+navitem.title}>
											<Image src={CDN_IMAGES+"/"+navitem.icon+".png"} alt={navitem.title} />
											<Text>
												{navitem.title}
											</Text>
										</NavLink>
									</ListItem>
								)
							})
						}
					</List>
					<Box mt={'auto'}>
						<List>
							<ListItem>
								<NavLink to={"/logout"}>
									<Image src={CDN_IMAGES+"/logout.png"} alt='Dan Abramov' />
									<Text>
										Logout
									</Text>
								</NavLink>
							</ListItem>
						</List>
					</Box>
				</Flex>
			</Box>
    </>
  )
}

export default sidebar