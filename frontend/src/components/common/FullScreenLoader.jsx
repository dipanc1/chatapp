import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

const FullScreenLoader = () => {
    return (
        <Box
            position='fixed'
            h='100vh'
            w='100%'
            top='0'
            left='0'
            background='rgba(0,0,0,0.3)'
            zIndex='10'
            display='flex'
            alignItems='center'
            justifyContent='center'
        >
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                size='xl'
                color='buttonPrimaryColor'
            />
        </Box>
    );
};

export default FullScreenLoader;
