import axios from 'axios';
import { Button, Flex, Heading, Modal, Text, VStack } from 'native-base';
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { backend_url } from '../../production';

const StreamModal = ({ user, open, setOpen, admin }) => {
    const { selectedChat, dispatch } = React.useContext(PhoneAppContext);
    const [disabled, setDisabled] = React.useState(false)
    const [meetingId, setMeetingId] = React.useState(null);

    return (
        <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
            <Modal.Content maxWidth="350">
                <Modal.Body>
                    <Flex marginY={'24'} height={'64'} justifyContent={'space-between'}>
                        <VStack alignItems={'center'}>
                            <Heading color={'primary.600'}>{admin ? 'Share the Video?' : 'Join the Video?'}
                            </Heading>
                            <Text color={'primary.600'}>
                                {admin ? 'You can share you screen with the members present in this group.' : 'You can join the video call with the members present in this group.'}
                            </Text>
                        </VStack>

                        <VStack space={'3'}>
                            <Button disabled={disabled} rounded={'lg'} bg={'primary.300'} w={'100%'} onPress={startMeeting}>
                                {admin ? 'Share' : 'Join'}
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