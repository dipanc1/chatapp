import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

import axios from 'axios';
import { format } from 'timeago.js'
import { Avatar, Box, Image, Text } from '@chakra-ui/react';

import { backend_url, checkFileExtension } from '../../utils';
import { AUDIO, DOC, IMAGE, PDF, PPT, TXT, VIDEO, XLS } from '../../constants';

import { BsFiletypeDocx } from 'react-icons/bs';
import { AiOutlineVideoCamera } from 'react-icons/ai';
import { BsFiletypeXls } from 'react-icons/bs';
import { MdAudiotrack } from 'react-icons/md'
import { AiOutlineFilePdf, AiOutlineFilePpt } from 'react-icons/ai';
import { GrDocumentTxt } from 'react-icons/gr';
import { BiFileBlank } from 'react-icons/bi';


const Message = ({ messages, own, sameSender, sameTime }) => {
    const { selectedChat } = useContext(AppContext);
    const user = JSON.parse(localStorage.getItem('user'))
    const size = 30;

    useEffect(() => {
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
                            <Box h='300px'>
                                <Image h='100%' w='100%' objectFit='cover' mx='auto' src={messages.content} alt='image' />
                            </Box>
                            : checkFileExtension(messages.content) ?
                                <Box onClick={() => window.open(messages.content, '_blank')} cursor='pointer' display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                                    {
                                        checkFileExtension(messages.content) === DOC ?
                                            <BsFiletypeDocx />
                                            : checkFileExtension(messages.content) === PDF ?
                                                <AiOutlineFilePdf size={size} />
                                                : checkFileExtension(messages.content) === PPT ?
                                                    <AiOutlineFilePpt size={size} />
                                                    : checkFileExtension(messages.content) === TXT ?
                                                        <GrDocumentTxt size={size} />
                                                        : checkFileExtension(messages.content) === XLS ?
                                                            <BsFiletypeXls size={size} />

                                                            : checkFileExtension(messages.content) === AUDIO ?
                                                                <MdAudiotrack size={size} />
                                                                :
                                                                checkFileExtension(messages.content) === VIDEO ?
                                                                    <AiOutlineVideoCamera size={size} />
                                                                    :
                                                                    <BiFileBlank size={size} />
                                    }
                                    <Text color={own ? 'white' : ''}>{messages.content.split('/')[messages.content.split('/').length - 1]}</Text>
                                </Box>
                                :
                                <Text color={own ? 'white' : ''}>{messages.content}</Text>
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
            </Box>
        ) : null
    )
}

export default Message