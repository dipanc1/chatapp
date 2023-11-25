import React from 'react'
import Static from '../components/common/Static'
import { Box, Center, Heading, Spinner, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import conversationApi from '../services/apis/conversationApi'
import { ONE } from '../constants'
import Pagination from '../components/Miscellaneous/Pagination'
import PostsCard from '../components/Posts/PostsCard'
import NothingToShowMessage from '../components/Miscellaneous/NothingToShowMessage'


const Posts = () => {
    const user = JSON.parse(localStorage.getItem('user'))
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
            'Authorization': `Bearer ${user.token}`
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const { data } = await conversationApi.getAllPosts(ONE, config)
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
    }, [user.token])

    const fetchMorePosts = async (page) => {
        setLoading(true);
        await conversationApi.getAllPosts(page, config).then(
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
            await conversationApi.deletePost(postId, chatId, config)
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
                                <PostsCard post={post} />
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