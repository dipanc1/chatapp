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
import GroupCard from '../components/Groups/GroupCard';

const groups = [
  {
    "name": "Cultural Group",
    "members": "17",
    "upcomingEvents": "2",
    "isAdmin": false
  },
  {
    "name": "Religious Group",
    "members": "21",
    "upcomingEvents": "4",
    "isAdmin": true
  },
  {
    "name": "Common",
    "members": "21",
    "upcomingEvents": "4",
    "isAdmin": true
  },
  {
    "name": "Fun Activites",
    "members": "21",
    "upcomingEvents": "4",
    "isAdmin": false
  },
  {
    "name": "Common",
    "members": "21",
    "upcomingEvents": "4",
    "isAdmin": false
  },
  {
    "name": "Fun Activites",
    "members": "21",
    "upcomingEvents": "4",
    "isAdmin": true
  }
]

function Groups() {
  return (
    <>
      <Static>
        <Flex pb='50px' alignItems='center' justifyContent='space-between'>
          <Heading as='h1' size='lg' fontWeight='500'>Groups</Heading>
          <NavLink className='btn btn-primary' to="/video-chat">
            <Flex alignItems='center'>
              <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
              <Text>Create New</Text>
            </Flex>
          </NavLink>
        </Flex>
        <Grid className='bg-variants' mb='70px' templateColumns='repeat(2, 1fr)' gap='2rem' rowGap='3rem'>
          {
            groups.map((groupItem) => {
              return (
                <GroupCard 
                  name={groupItem.name}
                  members={groupItem.members}
                  upcomingEvents={groupItem.upcomingEvents}
                  isAdmin={groupItem.isAdmin}
                />
              )
            })
          }
        </Grid>
      </Static>
    </>
  )
}

export default Groups