import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import SendEmailModal from '../UserModals/SendEmailModal'
import { BUTTONS, TITLES } from '../../constants'

const Help = () => {
    return (
        <Box display={['block', 'flex']} pt='40px' alignItems='center' justifyContent='space-between'>
            <Text pb={['12px', '0']} fontSize='18px' color='#6C4545' fontWeight='600'>
                {TITLES.SUPPORT_PORTAL}
            </Text>
            <NavLink className='btn btn-primary' to="#">
                <SendEmailModal>
                    <Flex alignItems='center'>
                        <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
                        <Text>{BUTTONS.RAISE_TICKET}</Text>
                    </Flex>
                </SendEmailModal>
            </NavLink>
        </Box>
    )
}

export default Help