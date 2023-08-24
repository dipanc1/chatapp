import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { MembersComponent } from '../UserChat/Members';

const DetailsModal = ({ children, fetchAgain, setFetchAgain, admin }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        children ?
            <span onClick={onOpen}>{children}</span> :
            <>
                <IconButton
                    aria-label='View Profile'
                    size='md'
                    onClick={onOpen}
                    icon={<ViewIcon />}
                />

                <Modal
                    size={['xs', 'xs', 'xl', 'lg']}
                    isCentered
                    onClose={onClose}
                    isOpen={isOpen}
                    motionPreset='slideInBottom'
                >
                    <ModalOverlay />
                    <ModalContent
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        borderRadius={'lg'}
                        border={'1px solid #eaeaea'}
                        boxShadow={'lg'}
                    >

                        <MembersComponent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} admin={admin} />
                    </ModalContent>

                </Modal>
            </>

    )
}

export default DetailsModal