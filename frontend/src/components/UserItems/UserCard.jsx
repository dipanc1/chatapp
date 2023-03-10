import React from 'react'
import { Box, Button, Flex, Image, ListItem, Text, UnorderedList } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

const UserCard = ({
    name,
    userName,
    profileImg
}) => {
  return (
    <Flex cursor={'pointer'} alignItems='center' p='18px' borderRadius='10px' border="0">
        <Image mr='13px' h="46px" w='46px' objectFit='cover' borderRadius='100%' src={profileImg} />
        <Box flex='1'>
            <Text color="#032E2B" fontWeight="600" as="h3">{userName.toUpperCase()}</Text>
            <Text color="#959595" fontSize='14px'>{name}</Text>
        </Box>
        {/* <NavLink className='btn btn-primary btn-sm'>
            Add
        </NavLink> */}
    </Flex>
  )
}

export default UserCard