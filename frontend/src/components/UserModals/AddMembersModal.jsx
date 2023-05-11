import React from 'react'
import {
    Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text
} from '@chakra-ui/react'
import UserListItem from '../UserItems/UserListItem'

const AddMembersModal = ({ isAddOpen, onAddClose, handleSearch, handleAddUser, loading, search, searchResults, fullScreen }) => {

    return (
        <Modal size={['xs', 'xs', 'xl', 'lg']} isOpen={isAddOpen} onClose={onAddClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Member</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxHeight={'lg'} overflow={'hidden'}>
                    <Input
                        value={search}
                        placeholder="Search Member" onChange={handleSearch}
                        focusBorderColor='#9F85F7'
                    />
                    {loading
                        ?
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            height={fullScreen ? '48' : '8'}
                        >
                            <Spinner
                                thickness='4px'
                                speed='0.6s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                        :
                        <Box height={fullScreen ? '48' : '8'}
                            overflowY={'scroll'}>
                            {search.length > 0 ?
                                searchResults?.map(user => (
                                    <Box
                                        my={'2'}
                                        _hover={{
                                            background: '#b5cbfe',
                                            color: 'white',
                                        }}
                                        bg={'#E8E8E8'}
                                        p={2}
                                        cursor={'pointer'}
                                        mx={'2rem'}
                                        borderRadius="lg"
                                        key={user._id}
                                        onClick={
                                            () => handleAddUser(user._id)
                                        }
                                    >
                                        <UserListItem user={user} />
                                    </Box>
                                ))
                                :
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}
                                    height={'100%'} >
                                    <Text fontSize={'x-large'}
                                        fontWeight={'bold'}
                                        color={'#9F85F7'} >Search for a user</Text>
                                </Box>
                            }
                        </Box>
                    }
                </ModalBody>

                <ModalFooter>
                    <Button backgroundColor={'buttonPrimaryColor'} color={'white'} mr={3} onClick={onAddClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddMembersModal