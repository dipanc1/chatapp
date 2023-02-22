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
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Events() {
  const { selectedChat } = useContext(AppContext);

  return (
    <>
      <Static>
        <Flex pb='50px' alignItems='center' justifyContent='space-between'>
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
          {selectedChat?.events.map((eventItem) => {
            return (
              <>
                <EventCard key={eventItem._id} title={eventItem.name} imageUrl={eventItem?.thumbnail} />
              </>
            )
          })}
        </Grid>
        <Flex pt='50px' pb='60px' borderTop='1px solid #eee' alignItems='center' justifyContent='space-between'>
          <Heading as='h2' size='md' fontWeight='500'>Past events</Heading>
          <NavLink className='btn-text' to="./create">See all</NavLink>
        </Flex>
        <Grid mb='70px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
          {selectedChat?.events.map((eventItem) => {
            return (
              <>
                <EventCard title={eventItem.name} imageUrl={eventItem?.thumbnail} />
              </>
            )
          })}
        </Grid>
      </Static>
    </>
  )
}

export default Events