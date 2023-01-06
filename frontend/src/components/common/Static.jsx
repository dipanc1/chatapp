import React from 'react'
import { 
  Box,
  Flex
} from '@chakra-ui/react';
import SideBar from './SideBar';
import Header from './Header';

const Static = (props) => {
  return (
    <>
			<Box minH='100vh' py='20px' px='30px' bg='backgroundColor'>
        <Flex height='100%'>
          <Box height='100%'>
            <SideBar />
          </Box>
          <Box ps='260px' flex='1'>
            <Header />
						<Box position='fixed' h='calc(100vh - 140px)' overflowY='auto' right='30px' left='290px' mt='100px' bg='#fff' p='40px' borderRadius='10px'>
							{props.children}
						</Box>
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export default Static