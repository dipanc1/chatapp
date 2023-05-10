import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, } from '@chakra-ui/react'
import React from 'react'
import { AppContext } from '../../context/AppContext'
import { HiUserRemove } from 'react-icons/hi'

const GroupSettingsModal = ({ isOpen, onClose, renameLoading, onConfirmOpen, handleRename, groupChatName, setGroupChatName, chatName, groupsTab }) => {
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
                            <Input
                                mr={'2'}
                                value={groupChatName}
                                placeholder={chatName}
                                _placeholder={{ color: 'inherit' }}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
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