import React, { useContext } from 'react'
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
import Lottie from 'lottie-react';
import animationData from '../../animations/red-dot.json';
import { RoomContext } from '../../context/RoomContext';


const StreamModalPeer = ({
    children,
    admin,
    title,
    date,
    time,
    imageUrl,
    description
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { dispatch } = useContext(AppContext);

    const { ws } = useContext(RoomContext);

    const createRoom = () => {
        ws.emit("create-room", localStorage.getItem('roomId') ? localStorage.getItem('roomId') : null);
        dispatch({
            type: "SET_STREAM"
        })
        dispatch({
            type: "SET_EVENT_INFO",
            payload: {
                title,
                date,
                time,
                imageUrl,
                description
            }
        })
    };

    const joinRoom = () => {
        dispatch({
            type: "SET_STREAM"
        })
        dispatch({
            type: "SET_EVENT_INFO",
            payload: {
                title,
                date,
                time,
                imageUrl,
                description
            }
        })
    };


    return (
        children ?
            <span>{children}</span> :
            <>
                <Button
                    background="#fff"
                    borderRadius="100%"
                    h='40px'
                    w='40px'
                    p='0'
                    onClick={() => {
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
                                <Button color='buttonPrimaryColor' variant='outline' mr={3} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button color={'whiteColor'} variant='solid' bg='buttonPrimaryColor'
                                    onClick={admin ? createRoom : joinRoom}
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

export default StreamModalPeer