import { Center, Heading } from '@chakra-ui/react'
import React from 'react'

const NothingToShowMessage = ({ children }) => {
    return (
        <Center w={'73.5vw'} flexWrap={'wrap'} my={'5'}
        >
            <Heading as="h1" size="lg">
                No {children} to show
            </Heading>
        </Center>
    )
}

export default NothingToShowMessage