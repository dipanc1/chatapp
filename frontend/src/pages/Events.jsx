import React from 'react'
import { NavLink } from "react-router-dom";
import { 
  Box, 
  Grid,
  Text,
  Heading,
  Button, 
  Container,
  Flex,
  Image
} from '@chakra-ui/react';

import Static from "../components/common/Static"
import EventCard from '../components/Events/EventCard';

function Events() {
  const EventsData = [
    {
      "title": "Ritviz Mimmi Album Launch Event",
      "imageUrl": "https://assets.website-files.com/5ff4e43997c4ec6aa5d646d1/603d547ed5c5fd6365dabbef_industry%20expert%20roundup%20-%20why%20are%20events%20important.png"
    },
    {
      "title": "Love A Fair With Darshan Raval",
      "imageUrl": "https://res.cloudinary.com/dwzmsvp7f/image/fetch/q_75,f_auto,w_400/https%3A%2F%2Fmedia.insider.in%2Fimage%2Fupload%2Fc_crop%2Cg_custom%2Fv1672731458%2Ffhjoxm0euja3cafmrtyt.jpg"
    },
    {
      "title": "INDIAN OCEAN LIVE AT THE FINCH",
      "imageUrl": "https://imageio.forbes.com/specials-images/imageserve/882906386/0x0.jpg?format=jpg&width=1200"
    }
  ]

  return (
    <>
      <Static>
        <Flex pt='10px' pb='50px' alignItems='center' justifyContent='space-between'>
          <Heading as='h1' size='lg' fontWeight='500'>Events</Heading>
          <NavLink className='btn btn-primary' to="./create">
            <Flex alignItems='center'>
            <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' /> 
            <Text>Create</Text>
            </Flex>
          </NavLink>
        </Flex>
        <Flex pt='50px' pb='60px' borderTop='1px solid #eee' alignItems='center' justifyContent='space-between'>
          <Heading as='h2' size='md' fontWeight='500'>Upcoming events</Heading>
          <NavLink className='btn-text' to="./create">See all</NavLink>
        </Flex>
        <Grid mb='70px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
          {EventsData.map((eventItem) => {
            return(
              <>
                <EventCard title={eventItem.title} imageUrl={eventItem.imageUrl} />
              </>
            )
          })}
        </Grid>
        <Flex pt='50px' pb='60px' borderTop='1px solid #eee' alignItems='center' justifyContent='space-between'>
          <Heading as='h2' size='md' fontWeight='500'>Past events</Heading>
          <NavLink className='btn-text' to="./create">See all</NavLink>
        </Flex>
        <Grid mb='70px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
          {EventsData.map((eventItem) => {
            return(
              <>
                <EventCard title={eventItem.title} imageUrl={eventItem.imageUrl} />
              </>
            )
          })}
        </Grid>
      </Static>
    </>
  )
}

export default Events