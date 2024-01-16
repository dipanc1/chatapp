import React, { useContext, useState } from 'react'
import Cookies from "universal-cookie";
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
import axios from 'axios';
import { backend_url } from '../../utils';
import Lottie from 'lottie-react';
import animationData from '../../animations/red-dot.json';


const StreamModal = ({ children, getMeetingAndToken, admin }) => {
    const cookies = new Cookies();
    const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" });

    const { isOpen, onOpen, onClose } = useDisclosure();

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
        // console.warn("STREAM MODAL which is joinscreen", data, "MEETING ID", meetingId);
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
                }}>{
                        !admin &&
                        <Lottie
                            loop={true}
                            style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                width: '10px',
                                height: '10px'
                            }}
                            animationData={animationData}
                        />
                    }
                    <AiOutlineVideoCamera />
                </Button>

                <Modal
                    size={['xs', 'md', 'md', 'md']}
                    isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            {'  '}
                        </ModalHeader>
                        <ModalBody minHeight={'48'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'}>
                            <Heading>
                                {admin ? 'Share the Video?' : 'Join the Video?'}
                            </Heading>
                            <Text fontSize='xl'>
                                {admin ? 'You can share you screen with the members present in this group.' : 'You can join the video call with the members present in this group.'}
                            </Text>
                            <Flex>
                                <Button isDisabled={disabled} color='buttonPrimaryColor' variant='outline' mr={3} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button isDisabled={disabled} color={'whiteColor'} variant='solid' bg='buttonPrimaryColor'
                                    onClick={startMeeting}
                                >{admin ? 'Share' : 'Join'}</Button>
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