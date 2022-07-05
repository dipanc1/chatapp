import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const GroupListItem = ({ group }) => {
    return (
        <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-around'}
            alignItems={'center'}
        >
            {/* <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />  */}
            {/* will add image later */}
            <Text>{group.chatName}</Text>
        </Box>
    )
}

export default GroupListItem