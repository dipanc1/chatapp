import React from 'react'
import Static from '../components/common/Static'
import { Box, Heading, Image, Text } from '@chakra-ui/react'

const ErrorSubscribing = () => {
  return (
    <Static>
        <Box
            display='flex'
            h='100%'
            alignItems='center'
            justifyContent='center'
            flexDirection='column'
        >
            <Image h='100px' src="data:image/png;base64,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" />
            <Heading py='20px' as='h1' size='lg' fontWeight='500'>Error Subscribing</Heading>
            <Text maxW='450px' textAlign='center'>There was error while subscribing to the membership. You can retry subscribing from the plans page present in settings.</Text>
        </Box>
    </Static>
  )
}

export default ErrorSubscribing