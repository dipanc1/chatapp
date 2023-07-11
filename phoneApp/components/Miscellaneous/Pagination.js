import { Box, Button, Flex, Text } from 'native-base'
import React from 'react'

const Pagination = ({ currentPage, totalPages, totalCount, currentCount, hasNextPage, hasPrevPage, paginateFunction }) => {
    return (
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} my={'1'}>
            {hasPrevPage && <Button mx={'2'} rounded={'lg'} bg={'primary.400'} onPress={
                () => {
                    paginateFunction(currentPage - 1)
                }
            }>Previous</Button>}
            {hasNextPage && <Button mx={'2'} rounded={'lg'} bg={'primary.400'} onPress={
                () => {
                    paginateFunction(currentPage + 1)
                }
            }>Next</Button>}
            <Flex direction="column" alignItems={'center'} mx='2'>
                <Text>
                    Page {currentPage} of {totalPages}
                </Text>
                <Text>
                    Showing 1-{currentCount} of {totalCount} results
                </Text>
            </Flex>

        </Box>
    )
}

export default Pagination