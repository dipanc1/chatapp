import { DeleteIcon } from '@chakra-ui/icons';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Divider, Flex, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import { BsPerson, BsTelephone } from 'react-icons/bs';
import './chatOnline.scss'

const ChatOnline = ({ user1, handleFunction }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <AccordionItem minWidth={'12vw'}>
            <h2>
                <AccordionButton
                    backgroundColor={'selectSecondaryColor'}
                    borderTopRadius={'md'}
                    _expanded={{ bg: 'selectPrimaryColor' }}
                    _hover={
                        {
                            backgroundColor: 'selectPrimaryColor',
                            color: '#000',
                            borderColor: '#000',
                            cursor: 'pointer',
                        }}>
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
            <AccordionPanel borderBottomRadius={'md'}
                bg={'selectPrimaryColor'}
                pb={4}
            >
                <Flex flexDir={'column'}>
                    <BsPerson />
                    <Text as='samp'>
                        {user1.username}
                    </Text>

                    <BsTelephone />
                    <Text as='samp'>
                        {user1.number}
                    </Text>
                    <Divider orientation='horizontal' color={'#000000'} my={'2'} />
                    {user._id === user1._id ?
                        null :
                        <>

                            <Text cursor={'pointer'} color={'errorColor'} as='samp' onClick={handleFunction}>
                                <DeleteIcon />  Remove from group
                            </Text>
                        </>}
                </Flex>
            </AccordionPanel>
        </AccordionItem>
    )
}

export default ChatOnline