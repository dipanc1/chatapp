import { Button, Flex, Heading, Modal, Text, VStack } from 'native-base';
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';

const StreamModal = ({ open, setOpen }) => {
    const { dispatch } = React.useContext(PhoneAppContext);

    return (
        <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
            <Modal.Content maxWidth="350">
                <Modal.Body>
                    <Flex marginY={'24'} height={'64'} justifyContent={'space-between'}>
                        <VStack alignItems={'center'}>
                            <Heading color={'primary.600'}>Share Video</Heading>
                            <Text color={'primary.600'}>
                                You can share you screen with the members present in this group.
                            </Text>
                        </VStack>

                        <VStack space={'3'}>
                            <Button rounded={'lg'} bg={'primary.300'} w={'100%'} onPress={
                                () => {
                                    dispatch({ type: 'SET_STREAM', payload: true });
                                    setOpen(false);
                                }
                            }>
                                Share
                            </Button>
                            <Button variant={'outline'} colorScheme="violet" rounded={'lg'} w={'100%'} onPress={() => setOpen(false)}>
                                Cancel
                            </Button>
                        </VStack>
                    </Flex>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    )
}

export default StreamModal