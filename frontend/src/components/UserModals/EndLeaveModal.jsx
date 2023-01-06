import React from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button
} from '@chakra-ui/react'

const EndLeaveModal = ({ leastDestructiveRef, onClose, header, body, confirmFunction, confirmButton, isOpen }) => {
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={leastDestructiveRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {header}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {body}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={leastDestructiveRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={confirmFunction} ml={3}>
                            {confirmButton}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

    )
}

export default EndLeaveModal