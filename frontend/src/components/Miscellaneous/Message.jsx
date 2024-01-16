import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

import { format } from 'timeago.js'
import Cookies from "universal-cookie";
import { Avatar, Box, Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorMode, useDisclosure } from '@chakra-ui/react';

import { checkFileExtension } from '../../utils';
import { AUDIO, DOC, IMAGE, PDF, PPT, TXT, VIDEO, XLS } from '../../constants';
import messageApi from '../../services/apis/messageApi'

import { BsFiletypeDocx } from 'react-icons/bs';
import { AiOutlineVideoCamera } from 'react-icons/ai';
import { BsDownload, BsFiletypeXls } from 'react-icons/bs';
import { MdAudiotrack } from 'react-icons/md'
import { AiOutlineFilePdf, AiOutlineFilePpt } from 'react-icons/ai';
import { GrDocumentTxt } from 'react-icons/gr';
import { BiFileBlank } from 'react-icons/bi';
import { useState } from 'react';

const size = 30;

const DownloadFileComponent = ({ content, children }) => {
    const [hover, setHover] = useState(false);
    const { colorMode } = useColorMode();

    return (
        <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'} w={'100%'} position={'relative'} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} cursor={'pointer'}>
            {children}
            {hover && <Box borderRadius={'50%'} bg={'rgba(0,0,0,0.5)'} height={'8'} width={'8'} display={'flex'} alignItems={'center'} justifyContent={'center'} position={'absolute'} top={'0'} right={'0'} opacity={'1'} zIndex={'1'}>
                <BsDownload size={20} onClick={() => window.open(content, '_blank')} color={colorMode === 'light' ? 'black' : 'white'} />
            </Box>}
        </Flex>
    )
}

const ImageViewer = ({ content, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Image src={content} width={'50vw'} height={'50vh'} objectFit={'contain'} />
                </ModalBody>
                <ModalFooter>
                    <Button bg={'selectPrimaryColor'} mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button bg={'buttonPrimaryColor'} color={'white'} mr={3} onClick={() => window.open(content, '_blank')}>
                        Download
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const Message = ({ messages, own, sameSender, sameTime }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode } = useColorMode();

    const { selectedChat } = useContext(AppContext);

    const [imageHover, setImageHover] = useState(false)

    const cookies = new Cookies();
    const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" })

    useEffect(() => {
        const readLastMessage = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }
                await messageApi.readMessages({
                    messageId: messages._id
                }, config)


            } catch (error) {
                console.log(error)
            }
        }

        readLastMessage()
    }, [messages, user.token])


    return (
        selectedChat?._id === messages?.chat._id ? (
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={own ? 'flex-end' : ''}
                mx={3}
                my={3}
            >
                <Box display={'flex'}>
                    {sameSender ?
                        <Avatar size='sm' mr={'1.5'} name={messages.sender.username} src={messages.sender.pic} />
                        :
                        <div style={{ width: '2.5rem' }}></div>
                    }
                    <Box p={2} borderRadius={'6px'} bg={own ? '#9F85F7' : '#F6F3FF'}>
                        {checkFileExtension(messages.content) === IMAGE ?
                            <Box position={'relative'} h='300px' cursor={'pointer'}
                                onMouseEnter={() => setImageHover(true)} onMouseLeave={() => setImageHover(false)}
                            >
                                {imageHover &&
                                    <Box borderRadius={'50%'} bg={'rgba(0,0,0,0.5)'} height={'9'} width={'9'} display={'flex'} alignItems={'center'} justifyContent={'center'} position={'absolute'} top={'1'} right={'1'} opacity={'1'} zIndex={'1'}>
                                        <BsDownload onClick={() => {
                                            window.open(messages.content, '_blank')
                                        }} cursor={'pointer'} color={colorMode === 'light' ? '' : 'black'} />
                                    </Box>
                                }
                                <Image onClick={onOpen} h='100%' w='100%' objectFit='cover' mx='auto' src={messages.content} alt='image' opacity={imageHover ? '0.8' : '1'} />
                            </Box>
                            : checkFileExtension(messages.content) ?
                                <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                                    {
                                        checkFileExtension(messages.content) === DOC ?
                                            <DownloadFileComponent content={messages.content}>
                                                <BsFiletypeDocx size={size} color={colorMode === 'light' ? '' : 'black'} />
                                            </DownloadFileComponent>
                                            : checkFileExtension(messages.content) === PDF ?
                                                <DownloadFileComponent content={messages.content}>
                                                    <AiOutlineFilePdf size={size} color={colorMode === 'light' ? '' : 'black'} />
                                                </DownloadFileComponent>
                                                : checkFileExtension(messages.content) === PPT ?
                                                    <DownloadFileComponent content={messages.content}>
                                                        <AiOutlineFilePpt size={size} color={colorMode === 'light' ? '' : 'black'} />
                                                    </DownloadFileComponent>
                                                    : checkFileExtension(messages.content) === TXT ?
                                                        <DownloadFileComponent content={messages.content}>
                                                            <GrDocumentTxt size={size} color={colorMode === 'light' ? '' : 'black'} />
                                                        </DownloadFileComponent>
                                                        : checkFileExtension(messages.content) === XLS ?
                                                            <DownloadFileComponent content={messages.content}>
                                                                <BsFiletypeXls size={size} color={colorMode === 'light' ? '' : 'black'} />
                                                            </DownloadFileComponent>
                                                            : checkFileExtension(messages.content) === AUDIO ?
                                                                <DownloadFileComponent content={messages.content}>
                                                                    <MdAudiotrack size={size} color={colorMode === 'light' ? '' : 'black'} />
                                                                </DownloadFileComponent>
                                                                :
                                                                checkFileExtension(messages.content) === VIDEO ?
                                                                    <DownloadFileComponent content={messages.content}>
                                                                        <AiOutlineVideoCamera size={size} color={colorMode === 'light' ? '' : 'black'} />
                                                                    </DownloadFileComponent>
                                                                    :
                                                                    <DownloadFileComponent content={messages.content}>
                                                                        <BiFileBlank size={size} color={colorMode === 'light' ? '' : 'black'} />
                                                                    </DownloadFileComponent>
                                    }
                                    <Text color={own ? 'white' : `${colorMode === 'light' ? '' : '#2b2929'}`}>{messages.content.split('/')[messages.content.split('/').length - 1]}</Text>
                                </Box>
                                :
                                <Text color={own ? 'white' : `${colorMode === 'light' ? '' : '#2b2929'}`}>{messages.content}</Text>
                        }
                    </Box>
                </Box>
                {sameTime ?
                    null
                    :
                    <Text ml={'10'} fontSize={'xs'}>
                        {format(messages.createdAt)}
                    </Text>
                }
                <ImageViewer content={messages.content} isOpen={isOpen} onClose={onClose} />
            </Box>
        ) : null
    )
}

export default Message