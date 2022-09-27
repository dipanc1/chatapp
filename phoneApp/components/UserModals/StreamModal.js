import axios from 'axios';
import { Button, Flex, Heading, Modal, Text, VStack } from 'native-base';
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { backend_url } from '../../production';

const StreamModal = ({ user, open, setOpen, getMeetingAndToken }) => {
    const { selectedChat, dispatch } = React.useContext(PhoneAppContext);
    const [disabled, setDisabled] = React.useState(false)
    const [meetingId, setMeetingId] = React.useState(null);

    const startMeeting = async () => {
        setDisabled(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        }
        const { data } = await axios.get(`${backend_url}/conversation/streaming/${selectedChat._id}`, config);
        setMeetingId(data);
        if (data) {
            dispatch({ type: 'SET_STREAMEXISTS', payload: true });
        }
        // console.warn("STREAM MODAL which is joinscreen", data, "MEETING ID", meetingId);
        await getMeetingAndToken(data);
        setOpen(false);
        dispatch({ type: 'SET_STREAM', payload: true });
    }

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
                            <Button disabled={disabled} rounded={'lg'} bg={'primary.300'} w={'100%'} onPress={startMeeting}>
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