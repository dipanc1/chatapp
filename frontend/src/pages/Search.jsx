import React, { useState } from 'react'
import { Box, Flex, Grid, Heading, Text, UnorderedList } from '@chakra-ui/react'

import Static from '../components/common/Static'
import GroupCard from '../components/Groups/GroupCard';
import UserCard from '../components/UserItems/UserCard';
import EventCard from '../components/Events/EventCard';

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

const Search = () => {
  const [activeTab, setActiveTab] = useState(1)
  return (
    <>
      <Static>
        <Box pb='30px'>
          <Heading as='h1' size='lg' fontWeight='500'>Search Results</Heading>
        </Box>
        <UnorderedList ps='0' ms='0' mb='30px' className="tab-nav">
          <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
            Users (4)
          </li>
          <li onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
            Groups (2)
          </li>
          <li onClick={() => setActiveTab(3)} className={activeTab === 3 ? "active" : ""}>
            Events (6)
          </li>
        </UnorderedList>
        <div className="tab-content">
          <div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>
            <Grid className='bg-variants' mb='70px' templateColumns='repeat(2, 1fr)' gap='2rem'>
              <UserCard />
              <UserCard />
              <UserCard />
            </Grid>
          </div>
          <div className={"tab-themes tab-content-item " + (activeTab === 2 ? "current" : "")}>
            <Grid className='bg-variants' mb='70px' templateColumns='repeat(2, 1fr)' gap='2rem' rowGap='3rem'>
              {
                groups.map((groupItem) => {
                  return (
                    <GroupCard
                      name={groupItem.name}
                      members={groupItem.members}
                      upcomingEvents={groupItem.upcomingEvents}
                      isAdmin={groupItem.isAdmin}
                      allowJoin="true"
                    />
                  )
                })
              }
            </Grid>
          </div>
          <div className={"tab-content-item " + (activeTab === 3 ? "current" : "")}>
            <Grid mb='70px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
              <EventCard />
            </Grid>
          </div>
        </div>
      </Static>
    </>
  )
}

export default Search