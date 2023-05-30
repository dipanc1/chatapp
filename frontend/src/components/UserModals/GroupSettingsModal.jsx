import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, Textarea, } from '@chakra-ui/react'
import React from 'react'
import { AppContext } from '../../context/AppContext'
import { HiUserRemove } from 'react-icons/hi'

const GroupSettingsModal = ({ isOpen, onClose, renameLoading, onConfirmOpen, handleRename, groupChatName, setGroupChatName, chatName, groupsTab, groupChatDescription, setGroupChatDescription, description }) => {
    const { fullScreen } = React.useContext(AppContext)

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Settings</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <hr />
                    {renameLoading ?
                        <Box display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            my={2}>
                            <Spinner
                                thickness='4px'
                                speed='0.7s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='md'
                            />
                        </Box>
                        :
                        <Box display={'flex'} flexDirection={'column'} mt="30px" mb={fullScreen ? '50px' : '2'}>
                            <Stack spacing={4}>

                                <FormControl>
                                    <FormLabel>Group Name</FormLabel>
                                    <Input
                                        mr={'2'}
                                        value={groupChatName}
                                        placeholder={chatName}
                                        _placeholder={{ color: 'inherit' }}
                                        onChange={(e) => setGroupChatName(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Group Description</FormLabel>
                                    <Textarea placeholder={description} value={groupChatDescription} mb={3} onChange={(e) => setGroupChatDescription(e.target.value)} focusBorderColor='#9F85F7' maxH={'100px'} />
                                </FormControl>
                            </Stack>
                        </Box>
                    }
                </ModalBody>

                <ModalFooter justifyContent='space-between'>
                    <Box my={fullScreen ? '2' : '0'}>
                        {!groupsTab &&
                            <Button size={fullScreen ? 'md' : 'sm'} onClick={onConfirmOpen} rightIcon={<HiUserRemove />} colorScheme='red' variant='outline'>
                                Leave Group
                            </Button>
                        }
                    </Box>
                    <button className='btn btn-primary' onClick={handleRename}>
                        Update
                    </button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default GroupSettingsModal