import React, { useEffect } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';

import axios from 'axios';
import { FiUpload } from 'react-icons/fi';

import postApi from '../../services/apis/postApi';

import { AppContext } from '../../context/AppContext';

import { api_key, folder, pictureUpload } from '../../utils';
import Cookies from 'universal-cookie';

import FullScreenLoader from '../common/FullScreenLoader';

const PostModal = ({
    children,
    post,
    deletePost,
    editPost,
    loading,
    setLoading,
}) => {
    const cookies = new Cookies();
    const user =
        JSON.parse(localStorage.getItem('user')) ||
        cookies.get(
            'auth_token',
            { domain: '.fundsdome.com' || 'localhost' },
            { path: '/' },
        );

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { signature, timestamp, selectedChat, getCloudinarySignature } =
        React.useContext(AppContext);

    const [userInfo, setUserInfo] = React.useState({
        title: '',
        description: '',
        selectedImage: null,
    });

    useEffect(() => {
        if (post !== undefined) {
            setUserInfo({
                title: post.title,
                description: post.description,
                selectedImage: null,
            });
        }
    }, [post]);

    const initialRef = React.useRef(null);
    const fileInputRef = React.createRef();
    const toast = useToast();

    const { title, description, selectedImage } = userInfo;

    const imageChange = async (e) => {
        await getCloudinarySignature();
        if (
            e.target.files &&
            e.target.files.length > 0 &&
            (e.target.files[0].type === 'image/jpeg' ||
                e.target.files[0].type === 'image/png')
        ) {
            setUserInfo({ ...userInfo, selectedImage: e.target.files[0] });
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

    const handleCreatePost = async (e) => {
        loading !== undefined && setLoading(true);
        const { title, description, selectedImage } = userInfo;
        if (title === '' || description === '' || selectedImage === null) {
            toast({
                title: 'Error',
                description: 'Please fill all the fields',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            loading !== undefined && setLoading(false);
            return;
        }

        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const formData = new FormData();
        formData.append('api_key', api_key);
        formData.append('file', selectedImage);
        formData.append('folder', folder);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);

        await axios
            .put(pictureUpload, formData)
            .then(async (res) => {
                await postApi.createPost(
                    selectedChat._id,
                    {
                        title,
                        description,
                        image: res.data.secure_url,
                    },
                    config,
                );

                toast({
                    title: 'Post Created!',
                    description: 'Post created successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left',
                });
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error Occured!',
                    description: 'Something went wrong',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left',
                });
            });
        setUserInfo({
            ...userInfo,
            title: '',
            description: '',
            selectedImage: null,
        });
        loading !== undefined && setLoading(false);
        onClose();
    };

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
                    {loading ? (
                        <FullScreenLoader />
                    ) : (
                        <>
                            <ModalHeader>
                                {post !== undefined ? 'Edit' : 'Create'} Post
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        required
                                        value={title}
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                title: e.target.value,
                                            })
                                        }
                                        focusBorderColor='#9F85F7'
                                        ref={initialRef}
                                        placeholder='Title'
                                    />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        required
                                        value={description}
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                description: e.target.value,
                                            })
                                        }
                                        focusBorderColor='#9F85F7'
                                        placeholder='Description'
                                        size='md'
                                        resize={'none'}
                                    />
                                </FormControl>

                                <FormControl mt={4}>
                                    <Text>Image</Text>
                                    {selectedImage ? (
                                        <Image
                                            width={'100px'}
                                            height={'100px'}
                                            src={URL.createObjectURL(
                                                selectedImage,
                                            )}
                                            alt={''}
                                            mt='3'
                                        />
                                    ) : post !== undefined ? (
                                        <Image
                                            width={'100px'}
                                            height={'100px'}
                                            src={post.image}
                                            alt={''}
                                            mt='3'
                                        />
                                    ) : null}
                                    <IconButton
                                        aria-label='upload picture'
                                        icon={<FiUpload />}
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                        size='xxl'
                                        colorScheme='teal'
                                        variant='outline'
                                        h='50px'
                                        w='50px'
                                        mt={'3'}
                                    />
                                    <input
                                        type='file'
                                        accept='image/*'
                                        alt='Select an image'
                                        ref={fileInputRef}
                                        onChange={imageChange}
                                        style={{ display: 'none' }}
                                    />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <HStack spacing={4}>
                                    {post !== undefined && (
                                        <Button
                                            onClick={() =>
                                                deletePost(post._id, post.chat)
                                            }
                                            height={'fit-content'}
                                            p={'15px 49px'}
                                            bg={'red.400'}
                                            borderRadius={'10px'}
                                            color={'white'}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                    <Button
                                        onClick={(e) => {
                                            post !== undefined
                                                ? editPost(
                                                      post._id,
                                                      post.chat,
                                                      title,
                                                      description,
                                                      selectedImage === null
                                                          ? post.image
                                                          : selectedImage,
                                                      selectedImage === null
                                                          ? null
                                                          : 'upload',
                                                  )
                                                : handleCreatePost(e);
                                        }}
                                        type='submit'
                                        height={'fit-content'}
                                        p={'15px 49px'}
                                        bg={'buttonPrimaryColor'}
                                        borderRadius={'10px'}
                                        color={'white'}
                                        isDisabled={
                                            post !== undefined &&
                                            title === post.title &&
                                            description === post.description &&
                                            selectedImage === null
                                        }
                                    >
                                        {post !== undefined ? 'Edit' : 'Create'}
                                    </Button>
                                </HStack>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default PostModal;
