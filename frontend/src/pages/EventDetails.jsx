import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Box,
    Text,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
} from '@chakra-ui/react';

import Static from '../components/common/Static';
import EventCard from '../components/Events/EventCard';
import VideoPlayer from '../components/Events/VideoPlayer';

const EventDetails = () => {
    const CDN_IMAGES = 'https://ik.imagekit.io/sahildhingra';

    const EventsData = [
        {
            title: 'Ritviz Mimmi Album Launch Event',
            imageUrl:
                'https://assets.website-files.com/5ff4e43997c4ec6aa5d646d1/603d547ed5c5fd6365dabbef_industry%20expert%20roundup%20-%20why%20are%20events%20important.png',
        },
        {
            title: 'Love A Fair With Darshan Raval',
            imageUrl:
                'https://res.cloudinary.com/dwzmsvp7f/image/fetch/q_75,f_auto,w_400/https%3A%2F%2Fmedia.insider.in%2Fimage%2Fupload%2Fc_crop%2Cg_custom%2Fv1672731458%2Ffhjoxm0euja3cafmrtyt.jpg',
        },
        {
            title: 'INDIAN OCEAN LIVE AT THE FINCH',
            imageUrl:
                'https://imageio.forbes.com/specials-images/imageserve/882906386/0x0.jpg?format=jpg&width=1200',
        },
    ];

    return (
        <>
            <Static>
                <Grid templateColumns='repeat(6, 1fr)' gap={10}>
                    <GridItem colSpan={4}>
                        <Box>
                            <VideoPlayer />
                            <Heading
                                pt='20px'
                                pb='35px'
                                as='h1'
                                size='lg'
                                fontWeight='500'
                            >
                                Love A Fair With Darshan Raval
                            </Heading>
                            <Flex justifyContent='end'>
                                <NavLink
                                    className='btn btn-primary'
                                    to='./create'
                                >
                                    <Flex alignItems='center'>
                                        <Image
                                            h='18px'
                                            pe='15px'
                                            src={CDN_IMAGES + '/like-white.png'}
                                        />
                                        <Text>Like</Text>
                                    </Flex>
                                </NavLink>
                                <NavLink
                                    style={{ margin: '0 20px' }}
                                    className='btn btn-primary'
                                    to='./create'
                                >
                                    <Flex alignItems='center'>
                                        <Image
                                            h='18px'
                                            pe='15px'
                                            src={
                                                CDN_IMAGES + '/share-white.png'
                                            }
                                        />
                                        <Text>Share</Text>
                                    </Flex>
                                </NavLink>
                                <NavLink
                                    className='btn btn-primary'
                                    to='./create'
                                >
                                    <Flex alignItems='center'>
                                        <Image
                                            h='18px'
                                            pe='15px'
                                            src={CDN_IMAGES + '/save-white.png'}
                                        />
                                        <Text>Save</Text>
                                    </Flex>
                                </NavLink>
                            </Flex>
                            <Box py='40px'>
                                <hr />
                            </Box>
                            <Box>
                                <Flex gap='25px' fontWeight='bold'>
                                    <Flex alignItems='center'>
                                        <Image
                                            h='18px'
                                            pe='6px'
                                            src={CDN_IMAGES + '/eye.png'}
                                        />
                                        <Text>1,54,909 Views</Text>
                                    </Flex>
                                    <Flex alignItems='center'>
                                        <Image
                                            h='18px'
                                            pe='6px'
                                            src={CDN_IMAGES + '/clock.png'}
                                        />
                                        <Text>2 Days ago</Text>
                                    </Flex>
                                </Flex>
                                <Text pt='20px'>
                                    Lorem ipsum dolor sit amet consectetur,
                                    adipisicing elit. Nihil dolore facere
                                    quaerat praesentium adipisci ex doloribus
                                    tenetur ab optio doloremque temporibus
                                    aliquam aliquid alias, animi excepturi!
                                    Nobis eos eaque maiores perspiciatis quidem
                                    necessitatibus nostrum consequatur fugiat
                                    voluptatibus? Perferendis provident fugiat
                                    quibusdam saepe atque earum labore, fugit
                                    quam quos cum culpa iste deserunt sint.
                                    Magni inventore, voluptas reiciendis, ea,
                                    minima vitae quod possimus totam consequatur
                                    vel facere! Sunt exercitationem eveniet
                                    harum. Tenetur voluptatem commodi officiis
                                    recusandae fugiat quisquam sunt dolorem?
                                    Cumque, assumenda aliquam! Officia provident
                                    ullam explicabo consectetur. Rerum
                                    consequatur inventore facilis accusantium
                                    optio perspiciatis obcaecati! Eius deleniti
                                    optio vitae possimus.
                                </Text>
                            </Box>
                            <Box py='40px'>
                                <hr />
                            </Box>
                            <Flex alignItems='center'>
                                <Image
                                    h='18px'
                                    pe='10px'
                                    src={CDN_IMAGES + '/comment.png'}
                                />
                                <Text fontWeight='bold'>Comments</Text>
                            </Flex>
                        </Box>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <Heading as='h2' pb='20px' size='md' fontWeight='500'>
                            Related Events
                        </Heading>
                        {EventsData.map((eventItem) => {
                            return (
                                <>
                                    <Box mb='50px'>
                                        <EventCard
                                            title={eventItem.title}
                                            imageUrl={eventItem.imageUrl}
                                        />
                                    </Box>
                                </>
                            );
                        })}
                    </GridItem>
                </Grid>
            </Static>
        </>
    );
};

export default EventDetails;
