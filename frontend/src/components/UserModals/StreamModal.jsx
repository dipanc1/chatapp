import React, { useContext, useEffect, useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit';
import { AppContext } from '../../context/AppContext';
import { AiOutlineVideoCamera } from 'react-icons/ai'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Text,
    Heading,
    Flex,
    ModalBody,
    ModalFooter,
    useDisclosure
} from '@chakra-ui/react'
import { useMeeting } from '@videosdk.live/react-sdk';
import axios from 'axios';
import { backend_url } from '../../production';


const StreamModal = ({ children, getMeetingAndToken }) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, dispatch } = useContext(AppContext);
    const [disabled, setDisabled] = useState(false)
    const [meetingId, setMeetingId] = useState(null);
    
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
        console.warn("STREAM MODAL which is joinscreen", data, "MEETING ID", meetingId);
        await getMeetingAndToken(data);
        onClose();
        dispatch({ type: 'SET_STREAM', payload: true });
    }


    return (
        children ?
            <span>{children}</span> :
            <>
                <Button onClick={() => {
                    onOpen();
                }}>
                    <AiOutlineVideoCamera />
                </Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            {'  '}
                        </ModalHeader>
                        <ModalBody minHeight={'48'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'} >
                            <Heading>
                                Share the Video?
                            </Heading>
                            <Text fontSize='xl'>
                                You can share you screen with the members present in this group.
                            </Text>
                            <Flex>
                                <Button color='buttonPrimaryColor' variant='outline' mr={3} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button disabled={disabled} color={'whiteColor'} variant='solid' bg='buttonPrimaryColor'
                                    onClick={startMeeting}
                                >Share</Button>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            {'  '}
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
    )
}

export default StreamModal