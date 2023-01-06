import React from 'react'
import { 
	Box, 
	Image,
	Text,
	Button, 
	Flex,
	Input
} from '@chakra-ui/react';

const Header = () => {

	const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";

  return (
    <>
			<Box zIndex='9' position='fixed' right='30px' left='290px' boxShadow={'Base'} bg={'white'} p={'20px'} borderRadius={'10px'}>
				<Flex alignItems='center'>
					<Input mx='auto' placeholder='Search' maxW={'400px'} py={'13px'} px={'21px'} bg={'#F4F1FF'} border={'0'} />
					<Flex>
						<Flex alignItems='center'>
							<Image height='23px' me='20px' src={CDN_IMAGES+"/messages.png"} />
							<Image height='25px' src={CDN_IMAGES+"/notification.png"} />
							<Button ms='15px' display='flex' alignItems='center' bg='transparent'>
								<Image borderRadius='full' boxSize='40px' src='https://bit.ly/dan-abramov' alt='Profile Pic' />
								<Text ps='15px' pe='10px'>
									John Doe
								</Text>
								<Image height='17px' src={CDN_IMAGES+"/down-arrow.png"} alt='' />
							</Button>	
						</Flex>	
					</Flex>
				</Flex>
				
			</Box>
    </>
  )
}

export default Header