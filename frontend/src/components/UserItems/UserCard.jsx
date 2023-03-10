import React from 'react'
import { Box, Button, Flex, Image, ListItem, Text, UnorderedList } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

const UserCard = (
    name,
    userName,
    profileImg
) => {
  return (
    <Flex p='18px' borderRadius='10px' border="0">
        <Image mr='13px' h="46px" w='46px' objectFit='cover' borderRadius='100%' src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80" />
        <Box flex='1'>
            <Text color="#032E2B" fontWeight="600" as="h3">Laura Johnson</Text>
            <Text color="#959595" fontSize='14px'>{userName}</Text>
        </Box>
        <NavLink className='btn btn-primary btn-sm'>
            Add
        </NavLink>
    </Flex>
  )
}

export default UserCard