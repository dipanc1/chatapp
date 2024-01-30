import React, { useContext } from 'react'
import Static from '../components/common/Static'
import { Box, Center, Heading, Spinner, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { ONE } from '../constants'
import Pagination from '../components/Miscellaneous/Pagination'
import PostsCard from '../components/Posts/PostsCard'
import NothingToShowMessage from '../components/Miscellaneous/NothingToShowMessage'
import postApi from '../services/apis/postApi'
import { AppContext } from '../context/AppContext'
import { api_key, folder, pictureUpload } from '../utils'
import axios from 'axios'
import Cookies from "universal-cookie";



const Posts = () => {
    const cookies = new Cookies();
    const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" })

    const { timestamp, signature } = useContext(AppContext)

    const [posts, setPosts] = React.useState([])
    const [loading, setLoading] = React.useState(false);
    const [totalCount, setTotalCount] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);
    const [currentCount, setCurrentCount] = React.useState(0);
    const [hasNextPage, setHasNextPage] = React.useState(false);
    const [hasPrevPage, setHasPrevPage] = React.useState(false);

    const toast = useToast()

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
        }
    };

    useEffect(() => {
        if (!user?.token) {
            return;
        }
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const { data } = await postApi.getAllPosts(ONE, config)
                setPosts(data.posts)
                setTotalCount(data.totalCount);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setCurrentCount(data.currentCount);
                setHasNextPage(data.hasNextPage);
                setHasPrevPage(data.hasPrevPage);
            } catch (error) {
                console.log(error)
                toast({
                    title: 'Error',
                    description: 'Could not fetch posts',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            setLoading(false)
        }

        fetchPosts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.token])

    const fetchMorePosts = async (page) => {
        setLoading(true);
        await postApi.getAllPosts(page, config).then(
            (response) => {
                setPosts(response.data.posts);
                setTotalCount(response.data.totalCount);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setCurrentCount(response.data.currentCount);
                setHasNextPage(response.data.hasNextPage);
                setHasPrevPage(response.data.hasPrevPage);
            }).catch((error) => {
                console.log(error);
                toast({
                    title: 'Error',
                    description: 'Could not fetch posts',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            })
        setLoading(false);
    }

    const deletePost = async (postId, chatId) => {
        try {
            await postApi.deletePost(postId, chatId, config)
            fetchMorePosts(currentPage)
            toast({
                title: 'Success',
                description: 'Post deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'Could not delete post',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const editPost = async (postId, chatId, title, description, image, type) => {
        setLoading(true);
        if (title === '' || description === '' || image === null) {
            toast({
                title: "Error",
                description: "Please fill all the fields",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        if (type === null) {
            try {
                await postApi.editPost(postId, chatId, { title, description, image: image }, config)
                fetchMorePosts(currentPage)
                toast({
                    title: 'Success',
                    description: 'Post edited successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } catch (error) {
                console.log(error)
                toast({
                    title: 'Error',
                    description: 'Could not edit post',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,

                })
            }
        } else {
            const formData = new FormData();
            formData.append('api_key', api_key)
            formData.append('file', image);
            formData.append('folder', folder)
            formData.append('timestamp', timestamp)
            formData.append('signature', signature)

            await axios.put(pictureUpload, formData)
                .then(async (res) => {
                    await postApi.editPost(postId, chatId, { title, description, image: res.data.secure_url }, config)
                    fetchMorePosts(currentPage)
                    toast({
                        title: 'Success',
                        description: 'Post edited successfully',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    })
                }).catch((error) => {
                    console.log(error)
                    toast({
                        title: 'Error',
                        description: 'Could not edit post',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    })
                })
        }
        setLoading(false);
    }

    return (
        <Static>
            <Heading as="h1" size="lg">Posts</Heading>
            {loading ?
                <Box py='100px' background='transparent' textAlign='center'>
                    <Spinner
                        thickness='4px'
                        speed='0.2s'
                        emptyColor='gray.200'
                        color='buttonPrimaryColor'
                        size='xl'
                    />
                </Box>
                :
                <>
                    <Center w={'73.5vw'} flexWrap={'wrap'} my={'5'}>
                        {posts.map((post, index) =>
                            <div key={post._id}>
                                <PostsCard post={post} deletePost={deletePost} editPost={editPost} loading={loading} setLoading={setLoading} />
                            </div>
                        )}
                    </Center>
                    {posts.length > 0 ? <Pagination paginateFunction={fetchMorePosts} currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} currentCount={currentCount} hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />
                        :
                        <NothingToShowMessage>
                            Posts
                        </NothingToShowMessage>
                    }
                </>
            }
        </Static>
    )
}

export default Posts