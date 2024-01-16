import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    AlertDialogCloseButton,
} from '@chakra-ui/react'
import { useContext } from 'react';
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Cookies from "universal-cookie";
import conversationApi from '../../services/apis/conversationApi';


const JoinGroupModal = ({ isOpenJoinEvent, onCloseJoinEvent, chatId, chatName }) => {
    const cancelRef = useRef();
    const navigate = useNavigate();
    const { dispatch, userInfo } = useContext(AppContext);
    const cookies = new Cookies();
    const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" });

    const handleJoinGroup = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await conversationApi.addToGroup(
            {
                chatId,
                userId: userInfo._id,
            },
            config
        );

        dispatch({ type: "SET_SELECTED_CHAT", payload: data });
        navigate(`/video-chat`);
        onCloseJoinEvent();
    }


    return (
        <>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onCloseJoinEvent}
                isOpen={isOpenJoinEvent}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>You have to join {chatName} group to join this event?</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        Are you sure you want to join this group? You can always leave later.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onCloseJoinEvent}>
                            No
                        </Button>
                        <Button onClick={handleJoinGroup} colorScheme='red' ml={3}>
                            Yes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default JoinGroupModal;