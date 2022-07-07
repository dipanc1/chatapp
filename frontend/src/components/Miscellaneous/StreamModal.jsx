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


const StreamModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, dispatch } = useContext(AppContext);
    const [transformmm, setTransformmm] = useState(false);
    const [isHost, setHost] = useState(false);
    const [isPinned, setPinned] = useState(false);
    const rtcProps = {
        appId: 'b73adb04d0a74614b6eeba2f4915cd17',
        channel: selectedChat.chatName, // your agora channel
        // token: '7b3ffd59228f48eb8605d091a8a32ec0', // use null or skip if using app in testing mode
        role: isHost ? 'host' : 'audience',
        layout: isPinned ? layout.pin : layout.grid,
        disableRtm: true,
    };

    // const callbacks = {
    //     EndCall: () => setVideocall(false),
    // };

    // const styleProps = {
    //     localBtnContainer: { backgroundColor: '#004dfa' },
    // };


    // const streamHandler = () => {
    //     setStreaming(!streaming);
    //     // setVideocall(!videocall);
    //     if (!videocall) {
    //         setVideocall(true);
    //         socket.emit("calling", selectedChat._id);
    //     }
    //     if (videocall) {
    //         socket.emit("stop calling", selectedChat._id);
    //         setVideocall(false);
    //     }
    // }

    // const fullScreenHandler = () => {
    //     setFullScreenMode(!fullScreenMode)
    // }

    // const styles = {
    //     stream: {
    //         display: 'flex',
    //         marginRight: '3vw',
    //         position: fullScreenMode ? 'absolute' : null,
    //         top: fullScreenMode ? 0 : null,
    //         left: fullScreenMode ? 0 : null,
    //         height: fullScreenMode ? '31vh' : null,
    //         width: fullScreenMode ? '100vw' : null,
    //         zIndex: fullScreenMode ? 1 : null,
    //     },

    //     container: {
    //         display: 'flex',
    //         backgroundColor: '#007bff22',
    //         width: fullScreenMode ? '100vw' : '51vw',
    //         height: fullScreenMode ? '100vh' : '50vh',
    //     },

    //     nav: {
    //         display: 'flex',
    //         justifyContent: 'space-around',
    //         alignItems: 'center',
    //         padding: '0.5rem',
    //         backgroundColor: '#007bff22',
    //     },

    //     btn: {
    //         display: 'flex',
    //         flexDirecton: 'column',
    //         backgroundColor: '#007bff',
    //         cursor: 'pointer',
    //         borderRadius: 5,
    //         padding: 5,
    //         margin: 5,
    //         color: '#ffffff',
    //         fontSize: 20
    //     },
    // }


    return (
        children ?
            <span>{children}</span> :
            <>
                <Button onClick={onOpen}
                    onMouseEnter={() => setTransformmm(true)}
                    onMouseLeave={() => setTransformmm(false)}>
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
                                <Button color={'whiteColor'} variant='solid' bg='buttonPrimaryColor'
                                onClick={
                                    () => {
                                        dispatch({ type: 'SET_STREAM', payload: true });
                                        onClose();
                                    }
                                }
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