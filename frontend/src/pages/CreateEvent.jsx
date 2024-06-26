import React, { useContext, useState } from 'react';
import {
    Box,
    Flex,
    Heading,
    Input,
    FormControl,
    FormLabel,
    Textarea,
    Checkbox,
    Image,
    IconButton,
    useToast,
} from '@chakra-ui/react';

import Static from '../components/common/Static';
import axios from 'axios';
import { api_key, pictureUpload, folder } from '../utils';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import eventsApi from '../services/apis/eventsApi';
import Cookies from 'universal-cookie';

const CreateEvent = () => {
    const {
        selectedChat,
        userInfo,
        timestamp,
        signature,
        getCloudinarySignature,
    } = useContext(AppContext);
    const cookies = new Cookies();
    const user =
        JSON.parse(localStorage.getItem('user')) ||
        cookies.get(
            'auth_token',
            { domain: '.fundsdome.com' || 'localhost' },
            { path: '/' },
        );
    const [name, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);

    const fileInputRef = React.createRef();

    const toast = useToast();
    let navigate = useNavigate();

    const imageChange = async (e) => {
        await getCloudinarySignature();
        if (
            e.target.files &&
            e.target.files.length > 0 &&
            (e.target.files[0].type === 'image/jpeg' ||
                e.target.files[0].type === 'image/png')
        ) {
            setSelectedImage(e.target.files[0]);
        } else {
            toast({
                title: 'Error',
                description: 'Please select a valid image',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedChat.groupAdmin._id !== userInfo._id)
            return alert('You are not the admin of this group');

        if (name === '' || description === '' || date === '' || time === '')
            return alert('Feilds cannot be empty');

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        if (selectedImage === null) {
            await eventsApi
                .addEvent(
                    selectedChat._id,
                    {
                        name,
                        description,
                        date,
                        time,
                    },
                    config,
                )
                .then((res) => {
                    // console.log(selectedChat)
                    navigate(`/video-chat`);
                    alert(res.data);
                })
                .catch((err) => {
                    console.log(err);
                    alert(err);
                });
        } else {
            const formData = new FormData();
            formData.append('api_key', api_key);
            formData.append('file', selectedImage);
            formData.append('folder', folder);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);

            await axios
                .post(pictureUpload, formData)
                .then(async (res) => {
                    await eventsApi
                        .addEvent(
                            selectedChat._id,
                            {
                                name,
                                description,
                                date,
                                time,
                                thumbnail: res.data.secure_url,
                            },
                            config,
                        )
                        .then((res) => {
                            navigate(`/video-chat`);
                            alert(res.data);
                        })
                        .catch((err) => {
                            console.log(err);
                            alert(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                    alert(err);
                });
        }
    };

    return (
        <>
            <Static>
                <Heading as='h1' size='lg' textAlign='center' fontWeight='500'>
                    Create Event
                </Heading>
                <Box maxW='450px' m='auto' pt='50px' className='form-wrapper'>
                    <form onSubmit={handleSubmit}>
                        <FormControl className={'filled'}>
                            <Input
                                type='text'
                                value={name}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                            <FormLabel>Event Name</FormLabel>
                        </FormControl>
                        <FormControl className={'filled'}>
                            <Textarea
                                type='text'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <FormLabel>Description</FormLabel>
                        </FormControl>
                        <Flex gap='6'>
                            <FormControl className={'filled'}>
                                <Input
                                    type='date'
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </FormControl>
                            <FormControl className={'filled'}>
                                <Input
                                    type='time'
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </FormControl>
                            <FormControl className={'filled'}>
                                <FormLabel>Upload Thumbnail</FormLabel>
                                <Image
                                    width={'100px'}
                                    height={'100px'}
                                    src={
                                        selectedImage
                                            ? URL.createObjectURL(selectedImage)
                                            : ''
                                    }
                                    alt={''}
                                />
                                <IconButton
                                    aria-label='upload picture'
                                    icon={<FiUpload />}
                                    onClick={() => fileInputRef.current.click()}
                                    size='xs'
                                    colorScheme='teal'
                                    variant='outline'
                                    mt={'3'}
                                />
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    onChange={imageChange}
                                    style={{ display: 'none' }}
                                />
                            </FormControl>
                        </Flex>
                        <Box>
                            <Checkbox
                                position='relative!important'
                                defaultChecked
                                pointerEvents='all!important'
                                left='0!important'
                                top='0!important'
                                padding='0!important'
                            >
                                Send Notification
                            </Checkbox>
                        </Box>
                        <Flex justifyContent='end' mt='40px'>
                            <button type='submit' className='btn btn-primary'>
                                Create
                            </button>
                        </Flex>
                    </form>
                </Box>
            </Static>
        </>
    );
};

export default CreateEvent;
