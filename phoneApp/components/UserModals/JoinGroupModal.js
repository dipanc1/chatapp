import React from 'react'
import { Button, AlertDialog, Text } from 'native-base'
import axios from 'axios';
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { backend_url } from '../../production';

const JoinGroupModal = ({ showModal, setShowModal, chatName, user, navigation, chatId }) => {
    const cancelRef = React.useRef(null);
    const onClose = () => setShowModal(false);

    const { dispatch, userInfo } = React.useContext(PhoneAppContext);

    const handleJoinGroup = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.put(
            `${backend_url}/conversation/groupadd`,
            {
                chatId,
                userId: userInfo?._id,
            },
            config
        );

        dispatch({ type: "SET_SELECTED_CHAT", payload: data });
        navigation.navigate(`Live Stream`);
        setShowModal(false);
    }

    return (
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={showModal} onClose={onClose}>
            <AlertDialog.Content>
                <AlertDialog.Header>
                    <Text color={'#42495d'} fontSize={'2xl'} bold>You have to join {chatName} group to join this event?</Text>
                </AlertDialog.Header>
                <AlertDialog.Body>
                    <Text>
                        Are you sure you want to join this group? You can always leave later.
                    </Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                    <Button mx={'3'} variant={'outline'} colorScheme="violet" rounded={'lg'} onPress={onClose} ref={cancelRef}>
                        No
                    </Button>
                    <Button rounded={'lg'} bg={'primary.300'} onPress={handleJoinGroup} >
                        Yes
                    </Button>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    )
}

export default JoinGroupModal