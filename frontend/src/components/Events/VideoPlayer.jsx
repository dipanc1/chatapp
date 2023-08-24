import React from 'react'
import { 
    Box, 
    Grid,
    Text,
    Heading,
    Button, 
    Container,
    Flex,
    Image
  } from '@chakra-ui/react';

const VideoPlayer = () => {
  return (
    <>
        <Box boxShadow='xl' rounded='md' overflow='hidden' className='video-player' position='relative'>
            <video width="100%" height="100%" poster='https://assets.website-files.com/5ff4e43997c4ec6aa5d646d1/603d547ed5c5fd6365dabbef_industry%20expert%20roundup%20-%20why%20are%20events%20important.png'>
                <source src="https://youtu.be/9xwazD5SyVg" type="video/mp4" />
            </video>
            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' bg='rgba(159,133,247,0.6)' position='absolute' top='0' h='100%' w='100%' className="subscription-overlay">
                <Box h='85px' w='85px' bg='#fff' mb='20px' borderRadius='100%' display='flex' alignItems='center' justifyContent='center'>
                    <Image ml='5px' h='32px' src="https://ik.imagekit.io/sahildhingra/play-button.png" />
                </Box>  
                <Text color='#fff'>
                    Requires Subscription
                </Text>
            </Box>
        </Box>
    </>
  )
}

export default VideoPlayer