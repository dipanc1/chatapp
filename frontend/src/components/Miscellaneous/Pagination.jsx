import { Box, Button, Flex } from '@chakra-ui/react';
import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    totalCount,
    currentCount,
    hasNextPage,
    hasPrevPage,
    paginateFunction,
}) => {
    return (
        <Box>
            <Flex justifyContent='space-between' alignItems='center'>
                {hasPrevPage && (
                    <Button
                        bg='buttonPrimaryColor'
                        color='white'
                        borderRadius='5px'
                        p='10px 20px'
                        _hover={{ bg: 'primary.600' }}
                        _active={{ bg: 'primary.700' }}
                        _focus={{ outline: 'none' }}
                        onClick={() => {
                            paginateFunction(currentPage - 1);
                        }}
                    >
                        Previous
                    </Button>
                )}
                {hasNextPage && (
                    <Button
                        bg='buttonPrimaryColor'
                        color='white'
                        borderRadius='5px'
                        p='10px 20px'
                        _hover={{ bg: 'primary.600' }}
                        _active={{ bg: 'primary.700' }}
                        _focus={{ outline: 'none' }}
                        onClick={() => {
                            paginateFunction(currentPage + 1);
                        }}
                    >
                        Next
                    </Button>
                )}
            </Flex>
            <Flex
                justifyContent='center'
                direction={'column'}
                alignItems='center'
                mt='10px'
            >
                <Box mr='10px' color='gray.500'>
                    Page {currentPage} of {totalPages}
                </Box>
                <Box color='gray.500'>
                    Showing 1-{currentCount} of {totalCount} results
                </Box>
            </Flex>
        </Box>
    );
};

export default Pagination;
