import {
    Avatar,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    IconButton,
    Image,
    Input,
    Text,
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { FiUpload } from 'react-icons/fi';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { api_key, backend_url, folder, pictureUpload } from '../../utils';
import Cookies from 'universal-cookie';
import { BUTTONS, FORM_LABELS } from '../../constants';

const MyDetails = ({
    username,
    setUsername,
    pic,
    setPic,
    number,
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

    const toast = useToast();
    const { colorMode } = useColorMode();

    const { dispatch, userInfo, getCloudinarySignature, timestamp, signature } =
        useContext(AppContext);

    const [selectedImage, setSelectedImage] = React.useState(null);

    const fileInputRef = React.createRef();

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

    const handleUpdateProfile = async (e) => {
        setLoading(true);
        e.preventDefault();
        let data;
        if (!username) {
            toast({
                title: 'Error',
                description: 'Please enter a username',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            toast({
                title: 'Error',
                description: 'Username should be at least 3 characters long',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        if (username.length > 20) {
            toast({
                title: 'Error',
                description: 'Username should be less than 20 characters long',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        if (!selectedImage && username === userInfo.username) {
            toast({
                title: 'Error',
                description:
                    'Picture is same as old picture and username is same as old username',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            if (selectedImage) {
                const formData = new FormData();
                formData.append('api_key', api_key);
                formData.append('file', selectedImage);
                formData.append('folder', folder);
                formData.append('timestamp', timestamp);
                formData.append('signature', signature);

                await axios
                    .post(pictureUpload, formData)
                    .then(
                        async (res) =>
                            (data = await axios.put(
                                `${backend_url}/users/update-user-info`,
                                {
                                    username,
                                    pic: res.data.secure_url,
                                },
                                config,
                            )),
                    )
                    .catch((err) => {
                        toast({
                            title: 'Error',
                            description: 'Error uploading picture',
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        });
                    });
            } else {
                data = await axios.put(
                    `${backend_url}/users/update-user-info`,
                    {
                        username,
                        pic,
                    },
                    config,
                );
            }

            toast({
                title: 'Success',
                description: data.data.message,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            setUsername(data.data.username);
            setPic(data.data.pic);
            dispatch({ type: 'SET_USER_INFO', payload: data.data });
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: 'Error updating profile',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleUpdateProfile}>
            <Grid
                mt='70px'
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                gap='5rem'
                rowGap={['1rem', '3rem']}
                className='form-wrapper form-details'
            >
                <GridItem w='100%'>
                    <FormControl className='filled'>
                        <Input
                            color={colorMode === 'light' ? 'black' : 'black'}
                            pt='25px'
                            pb='20px'
                            type='text'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <FormLabel>{FORM_LABELS.USERNAME}</FormLabel>
                    </FormControl>
                </GridItem>
                <GridItem w='100%'>
                    <FormControl className='filled'>
                        <Input
                            color={colorMode === 'light' ? 'black' : 'black'}
                            pt='25px'
                            pb='20px'
                            type='text'
                            disabled
                            value={number}
                        />
                        <FormLabel>{FORM_LABELS.NUMBER}</FormLabel>
                    </FormControl>
                </GridItem>
            </Grid>
            <Grid
                mt='30px'
                templateColumns='repeat(2, 1fr)'
                gap='5rem'
                rowGap='3rem'
                className='form-wrapper form-details'
            >
                <GridItem w='100%'>
                    <FormControl className='filled'>
                        <Avatar
                            size={'2xl'}
                            src={
                                selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : pic
                            }
                            alt={'Avatar Alt'}
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
                        <FormLabel>{FORM_LABELS.PROFILE_IMAGE}</FormLabel>
                    </FormControl>
                </GridItem>
            </Grid>
            <Flex
                pt={['20px', '50px']}
                alignItems='center'
                justifyContent='end'
            >
                <Button type='submit' bg='buttonPrimaryColor' color={'white'}>
                    <Image
                        h='18px'
                        pe='15px'
                        src='https://ik.imagekit.io/sahildhingra/edit.png'
                    />
                    <Text>{BUTTONS.EDIT_PROFILE}</Text>
                </Button>
            </Flex>
        </form>
    );
};

export default MyDetails;
