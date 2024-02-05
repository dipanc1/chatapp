import { Box, Button, Heading, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import PostModal from '../UserModals/PostModal'

const PostsCard = ({ post, deletePost, editPost, loading, setLoading }) => {
    return (
        <Box
            role={'group'}
            my={'10'}
            mx={'5'}
            p={6}
            w={'330px'}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'lg'}
            pos={'relative'}
            zIndex={1}>
            <Box
                rounded={'lg'}
                mt={-12}
                pos={'relative'}
                height={'230px'}
                _after={{
                    transition: 'all .3s ease',
                    content: '""',
                    w: 'full',
                    h: 'full',
                    pos: 'absolute',
                    top: 5,
                    left: 0,
                    backgroundImage: `url(${post.image})`,
                    filter: 'blur(15px)',
                    zIndex: -1,
                }}
                _groupHover={{
                    _after: {
                        filter: 'blur(20px)',
                    },
                }}>
                <Image
                    rounded={'lg'}
                    height={230}
                    width={282}
                    objectFit={'cover'}
                    src={post.image}
                    alt="#"
                />
            </Box>
            <Stack pt={10} align={'center'}>
                <Heading fontSize={
                    post.title.length > 20 ? 'sm' : 'lg'
                } fontFamily={'body'} fontWeight={500}>
                    {post.title.slice(0, 30)}{post.title.length > 30 ? '...' : ''}
                </Heading>
                <Text fontWeight={800} fontSize={'md'}>
                    {post.description.slice(0, 30)}{post.description.length > 30 ? '...' : ''}
                </Text>
            </Stack>
            <PostModal post={post} deletePost={deletePost} editPost={editPost} loading={loading} setLoading={setLoading}>
                <Button
                    w={'100%'}
                    mt={2}
                    bg={useColorModeValue('#151f21', 'gray.900')}
                    color={'white'}
                    rounded={'md'}
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                    }}>
                    Edit
                </Button>
            </PostModal>
        </Box>
    )
}

export default PostsCard