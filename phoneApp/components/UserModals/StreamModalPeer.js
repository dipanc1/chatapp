import axios from 'axios';
import { Button, Flex, Heading, Modal, Text, VStack } from 'native-base';
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { backend_url } from '../../utils';
import { RoomContext } from '../../context/RoomContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StreamModal = ({ open, setOpen, admin }) => {
    const [roomId, setRoomId] = React.useState(null);
    const { dispatch } = React.useContext(PhoneAppContext);

    const { ws } = React.useContext(RoomContext);


    React.useEffect(() => {
        const roomIds = async () => {
            try {
                const value = await AsyncStorage.getItem('roomId')
                return value != null ? value : null
            } catch (e) {
                // read error
                console.log(e)
            }
        }

        roomIds().then((res) => {
            setRoomId(res);
        })
    }, [])


    const createRoom = () => {
        ws.emit("create-room", roomId ? roomId : null);
        dispatch({
            type: "SET_STREAM"
        })
        // dispatch({
        //     type: "SET_EVENT_INFO",
        //     payload: {
        //         title,
        //         date,
        //         time,
        //         imageUrl,
        //         description
        //     }
        // })
    };

    const joinRoom = () => {
        dispatch({
            type: "SET_STREAM"
        })
        // dispatch({
        //     type: "SET_EVENT_INFO",
        //     payload: {
        //         title,
        //         date,
        //         time,
        //         imageUrl,
        //         description
        //     }
        // })
    };

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
                            <Button rounded={'lg'} bg={'primary.300'} w={'100%'} onPress={admin ? createRoom : joinRoom}>
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