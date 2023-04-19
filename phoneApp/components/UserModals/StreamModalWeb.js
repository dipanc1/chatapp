import axios from 'axios';
import { Button, Flex, Heading, Modal, Text, VStack } from 'native-base';
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { backend_url } from '../../production';
import { RoomContext } from '../../context/RoomContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from 'react-native';

const StreamModal = ({ open, setOpen, admin }) => {

    const redirectToWebApp = () => {
        // Checking if the link is supported for links with custom URL scheme.
        try {
            Linking.openURL(backend_url);
        } catch (error) {
            console.log(error);
        }
    }


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
                            <Button rounded={'lg'} bg={'primary.300'} w={'100%'} onPress={redirectToWebApp}>
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