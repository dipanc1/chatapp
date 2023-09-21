import { Box, Button, Center, Flex, HStack, Icon, IconButton, Modal, Text } from 'native-base'
import React from 'react'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { format } from 'timeago.js';
import axios from 'axios';
import { backend_url, checkFileExtension } from '../../utils';
import { Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { AUDIO, DOC, IMAGE, PDF, PPT, TXT, VIDEO, XLS } from '../../constants';

const size = 32;
const DownloadFileComponent = ({ content, children }) => {
    return (
        <Flex direction={'row'} alignItems={'center'} width={'100%'} justifyContent={'space-around'} position={'relative'}>
            {children}
            <IconButton icon={<MaterialIcons name="file-download" size={size} color={'white'} />} />
        </Flex>
    )
}

const ImageViewer = ({ showModal, setShowModal, content }) => {
    return <Center>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Image</Modal.Header>
                <Modal.Body display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    {checkFileExtension(content) === IMAGE && <Image source={
                        {
                            uri: content
                        }
                    } alt={'image'} style={{
                        width: '100%',
                        height: '100%'
                    }} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant={'outline'} colorScheme="violet" rounded={'lg'} onPress={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button rounded={'lg'} bg={'primary.300'}>
                            {'Download'}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    </Center>;
};

const Message = ({ messages, own, sameSender, sameTime, user }) => {
    const { selectedChat } = React.useContext(PhoneAppContext);
    const [showModal, setShowModal] = React.useState(false);


    React.useEffect(() => {
        const readLastMessage = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }
                await axios.post(`${backend_url}/message/read`, {
                    messageId: messages._id
                }, config)


            } catch (error) {
                console.log(error)
            }
        }

        readLastMessage()
    }, [messages, user.token])

    return (
        selectedChat._id === messages?.chat._id ? <Flex>
            <HStack justifyContent={'space-between'} alignItems={'center'} >
                {(sameSender && messages.sender.pic !== null) ? <Image
                    source={{
                        uri: messages.sender.pic
                    }}
                    alt={messages.sender.username}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 100,
                        alignSelf: "center"
                    }}
                /> : <Box width={'32px'} height={'32px'}></Box>}

                <Flex my={'5'} width={'100%'}>

                    {!sameTime && <Text marginRight={own ? '0' : '10'} marginLeft={own ? '10' : '0'} fontSize={'xs'}>{format(new Date(messages.createdAt).valueOf())}</Text>}

                    <Box rounded={'lg'} p={'2'} marginRight={own ? '10' : '10'} marginLeft={own ? '10' : '0'} bg={own ? 'primary.400' : 'primary.200'}>
                        {checkFileExtension(messages.content) === IMAGE ?
                            <Box position={'relative'} h='300px'>
                                <IconButton position={'absolute'} top={'1'} right={'1'} icon={<MaterialIcons name="file-download" size={size} color={'white'} />} />
                                <TouchableOpacity onPress={
                                    () => setShowModal(true)
                                }>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 10
                                        }}
                                        objectFit='cover' mx='auto' source={
                                            {
                                                uri: messages.content
                                            }
                                        } alt={'image'} />
                                </TouchableOpacity>
                                <ImageViewer showModal={showModal} setShowModal={setShowModal} content={messages.content} />
                            </Box>
                            : checkFileExtension(messages.content) ?
                                <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                                    {
                                        checkFileExtension(messages.content) === DOC ?
                                            <DownloadFileComponent content={messages.content}>
                                                <IconButton icon={<MaterialIcons name="article" size={size} color="white" />} />
                                            </DownloadFileComponent>
                                            : checkFileExtension(messages.content) === PDF ?
                                                <DownloadFileComponent content={messages.content}>
                                                    <IconButton icon={<MaterialIcons name="picture-as-pdf" size={size} color="white" />} />
                                                </DownloadFileComponent>
                                                : checkFileExtension(messages.content) === PPT ?
                                                    <DownloadFileComponent content={messages.content}>
                                                        <IconButton icon={<MaterialIcons name="file-present" size={size} color="white" />} />
                                                    </DownloadFileComponent>
                                                    : checkFileExtension(messages.content) === TXT ?
                                                        <DownloadFileComponent content={messages.content}>
                                                            <IconButton icon={<MaterialIcons name="text-snippet" size={size} color="white" />} />
                                                        </DownloadFileComponent>
                                                        : checkFileExtension(messages.content) === XLS ?
                                                            <DownloadFileComponent content={messages.content}>
                                                                <IconButton icon={<MaterialIcons name="grid-on" size={size} color="white" />} />
                                                            </DownloadFileComponent>
                                                            : checkFileExtension(messages.content) === AUDIO ?
                                                                <DownloadFileComponent content={messages.content}>
                                                                    <IconButton icon={<MaterialIcons name="audiotrack" size={size} color="white" />} />
                                                                </DownloadFileComponent>
                                                                :
                                                                checkFileExtension(messages.content) === VIDEO ?
                                                                    <DownloadFileComponent content={messages.content}>
                                                                        <IconButton icon={<MaterialIcons name="music-video" size={size} color="white" />} />
                                                                    </DownloadFileComponent>
                                                                    :
                                                                    <DownloadFileComponent content={messages.content}>
                                                                        <IconButton icon={<MaterialIcons name="file-present" size={size} color="white" />} />
                                                                    </DownloadFileComponent>
                                    }
                                    <Text color={own ? '#fff' : 'primary.600'}>{messages.content.split('/')[messages.content.split('/').length - 1]}</Text>
                                </Box>
                                :
                                <Text color={own ? '#fff' : 'primary.600'} fontSize={'lg'}>{messages.content}</Text>
                        }
                    </Box>
                </Flex>
            </HStack>
        </Flex> : null
    )
}

export default Message