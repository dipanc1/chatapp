import React from 'react'
import { FormControl, FormLabel, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'

import axios from 'axios';
import { FiUpload } from 'react-icons/fi'

import conversationApi from '../../services/apis/conversationApi';

import { AppContext } from '../../context/AppContext';

import { api_key, folder, pictureUpload } from '../../utils';

import FullScreenLoader from '../common/FullScreenLoader';

const PostPictureModal = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { signature, timestamp, selectedChat, getCloudinarySignature } = React.useContext(AppContext)
    const [userInfo, setUserInfo] = React.useState(
        {
            title: '',
            description: '',
            selectedImage: null,
            loading: false,
        }
    )

    const initialRef = React.useRef(null)
    const fileInputRef = React.createRef();
    const toast = useToast();


    const { title, description, selectedImage, loading } = userInfo;

    const imageChange = async (e) => {
        await getCloudinarySignature();
        if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png')) {
            setUserInfo({ ...userInfo, selectedImage: e.target.files[0] });
        } else {
            toast({
                title: "Error",
                description: "Please select a valid image",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const handleCreatePost = async (e) => {
        setUserInfo({ ...userInfo, loading: true });
        const { title, description, selectedImage } = userInfo;
        if (title === '' || description === '' || selectedImage === null) {
            toast({
                title: "Error",
                description: "Please fill all the fields",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            setUserInfo({ ...userInfo, loading: false });
            return;
        }

        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const formData = new FormData();
        formData.append('api_key', api_key)
        formData.append('file', selectedImage);
        formData.append('folder', folder)
        formData.append('timestamp', timestamp)
        formData.append('signature', signature)

        await axios.put(pictureUpload, formData)
            .then(async (res) => {
                await conversationApi.createPost(selectedChat._id, {
                    title,
                    description,
                    image: res.data.url,
                }, config)

                toast({
                    title: "Post Created!",
                    description: "Post created successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Error Occured!",
                    description: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
            });
        setUserInfo({ ...userInfo, loading: false, title: '', description: '', selectedImage: null });
        onClose();
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    {loading ? <FullScreenLoader />
                        :
                        <>
                            <ModalHeader>Create Post</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>Title</FormLabel>
                                    <Input required value={title}
                                        onChange={(e) => setUserInfo({ ...userInfo, title: e.target.value })} focusBorderColor='#9F85F7' ref={initialRef} placeholder='Title' />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea required value={description}
                                        onChange={(e) => setUserInfo({ ...userInfo, description: e.target.value })}
                                        focusBorderColor='#9F85F7' placeholder='Description' size='md'
                                        resize={'none'} />
                                </FormControl>

                                <FormControl mt={4}>
                                    <Text>Image</Text>
                                    {
                                        selectedImage && (
                                            <Image
                                                width={'100px'}
                                                height={'100px'}
                                                src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
                                                alt={''}
                                                mt='3'
                                            />
                                        )

                                    }
                                    <IconButton
                                        aria-label="upload picture"
                                        icon={<FiUpload />}
                                        onClick={() => fileInputRef.current.click()}
                                        size="xxl"
                                        colorScheme="teal"
                                        variant="outline"
                                        h='50px'
                                        w='50px'
                                        mt={'3'}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        alt="Select an image"
                                        ref={fileInputRef}
                                        onChange={imageChange}
                                        style={{ display: 'none' }}
                                    />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <button onClick={
                                    e => { handleCreatePost(e) }
                                } type='submit' className='btn btn-primary'>
                                    Create
                                </button>
                            </ModalFooter>
                        </>
                    }
                </ModalContent>
            </Modal>
        </>
    )
}

export default PostPictureModal