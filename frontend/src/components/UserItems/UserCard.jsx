import React from 'react';
import { Box, Flex, Image, Text, useColorMode } from '@chakra-ui/react';

const UserCard = ({ name, userName, profileImg }) => {
    const { colorMode } = useColorMode();

    return (
        <Flex
            cursor={'pointer'}
            alignItems='center'
            p='18px'
            borderRadius='10px'
            border='0'
        >
            <Image
                mr='13px'
                h='46px'
                w='46px'
                objectFit='cover'
                borderRadius='100%'
                src={profileImg}
            />
            <Box flex='1'>
                <Text
                    color={colorMode === 'light' ? '#032E2B' : '#fff'}
                    fontWeight='600'
                    as='h3'
                >
                    {userName.toUpperCase()}
                </Text>
                <Text color='#959595' fontSize='14px'>
                    {name}
                </Text>
            </Box>
            {/* <NavLink className='btn btn-primary btn-sm'>
            Add
        </NavLink> */}
        </Flex>
    );
};

export default UserCard;
