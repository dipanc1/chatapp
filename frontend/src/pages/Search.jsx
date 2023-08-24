import React, { useState } from 'react'
import { Box, Grid, Heading, UnorderedList } from '@chakra-ui/react'

import Static from '../components/common/Static'
import GroupCard from '../components/Groups/GroupCard';
import UserCard from '../components/UserItems/UserCard';
import EventCard from '../components/Events/EventCard';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';


const Search = () => {
  const { searchResults } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <Static>
        <Box pb='30px'>
          <Heading as='h1' size='lg' fontWeight='500'>Search Results</Heading>
        </Box>
        <UnorderedList ps='0' ms='0' mb='30px' className="tab-nav">
          <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
            Users {searchResults.length > 0 && "(" + searchResults.users.length + ")"}
          </li>
          <li onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
            Groups {searchResults.length > 0 && "(" + searchResults.groups.length + ")"}
          </li>
          <li onClick={() => setActiveTab(3)} className={activeTab === 3 ? "active" : ""}>
            Events {searchResults.length > 0 && "(" + searchResults.events.length + ")"}
          </li>
        </UnorderedList>
        <div className="tab-content">
          <div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>
            <Grid className='bg-variants' mb='70px' templateColumns='repeat(2, 1fr)' gap='2rem'>
              {searchResults.length > 0 && searchResults.users.map((userItem) =>
                <UserCard userName={userItem.username} />
              )}
            </Grid>
          </div>
          <div className={"tab-themes tab-content-item " + (activeTab === 2 ? "current" : "")}>
            <Grid className='bg-variants' mb='70px' templateColumns='repeat(2, 1fr)' gap='2rem' rowGap='3rem'>
              {searchResults.length > 0 && searchResults.groups.map((groupItem) => {
                return (
                  <GroupCard
                    name={groupItem.name}
                    members={groupItem.members}
                    // upcomingEvents={groupItem.events}
                    // isAdmin={groupItem.isAdmin}
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