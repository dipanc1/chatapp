import { DeleteIcon } from '@chakra-ui/icons';
import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Avatar,
    Box,
    Divider,
    Flex,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useContext, useRef } from 'react';
import { BsPerson, BsTelephone } from 'react-icons/bs';
import EndLeaveModal from '../UserModals/EndLeaveModal';
import { AppContext } from '../../context/AppContext';

const ChatOnline = ({ stream, id, user1, handleFunction, admin }) => {
    const { userInfo } = useContext(AppContext);

    const removeRef = useRef();

    const {
        isOpen: isRemoveOpen,
        onOpen: onRemoveOpen,
        onClose: onRemoveClose,
    } = useDisclosure();

    return (
        <>
            <AccordionItem key={id} minWidth={stream ? '19vw' : '12vw'}>
                <h2>
                    <AccordionButton
                        backgroundColor={''}
                        borderTopRadius={'md'}
                        _expanded={{ bg: 'selectPrimaryColor' }}
                        _hover={{
                            backgroundColor: 'selectPrimaryColor',
                            color: '#000',
                            borderColor: '#000',
                            cursor: 'pointer',
                        }}
                    >
                        <Box flex='1' textAlign='left'>
                            <Flex align={'center'}>
                                <Avatar
                                    src={user1.pic}
                                    size={'lg'}
                                    name={user1.username}
                                    ml={-1}
                                    mr={2}
                                />
                                {user1.username}
                            </Flex>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel
                    borderBottomRadius={'md'}
                    bg={'selectPrimaryColor'}
                    pb={4}
                >
                    <Flex
                        flexDir={'column'}
                        alignItems={stream ? 'center' : ''}
                    >
                        <BsPerson />
                        <Text as='samp'>{user1.username}</Text>
                        {!stream && (
                            <>
                                <BsTelephone />
                                <Text as='samp'>+{user1.number}</Text>
                            </>
                        )}

                        <Divider
                            orientation='horizontal'
                            color={'#000000'}
                            my={'2'}
                        />
                        {admin && user1.username !== userInfo.username && (
                            <>
                                <Text
                                    cursor={'pointer'}
                                    color={'errorColor'}
                                    as='samp'
                                    onClick={onRemoveOpen}
                                >
                                    <DeleteIcon /> Remove from group
                                </Text>
                            </>
                        )}
                    </Flex>
                </AccordionPanel>
            </AccordionItem>

            {/* Confirm remove member */}
            <EndLeaveModal
                leastDestructiveRef={removeRef}
                onClose={onRemoveClose}
                header={'Remove Member'}
                body={`Are you sure you want to remove ${user1.username} from the group?`}
                confirmButton={'Remove'}
                confirmFunction={() => {
                    handleFunction();
                    onRemoveClose();
                }}
                isOpen={isRemoveOpen}
            />
        </>
    );
};

export default ChatOnline;
