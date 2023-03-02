import React, {
  useState
} from 'react'
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
  const [activeTab, setActiveTab] = useState(1)

  const { selectedChat } = useContext(AppContext);

  return (
    <>
      <Static>
        <Flex pb='30px' alignItems='center' justifyContent='space-between'>
          <Heading as='h1' size='lg' fontWeight='500'>Events</Heading>
          <NavLink className='btn btn-primary' to="./create">
            <Flex alignItems='center'>
              <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
              <Text>Create</Text>
            </Flex>
          </NavLink>
        </Flex>
        <Box pb='30px'>
          <ul className="tab-nav">
            <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
              Group Events
            </li>
            <li onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
              Upcoming Events
            </li>
            <li onClick={() => setActiveTab(3)} className={activeTab === 3 ? "active" : ""}>
              Previous Events
            </li>
          </ul>
        </Box>
        <div className="tab-content">
          <div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>
            <Grid mb='70px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
              {selectedChat?.events.map((eventItem) => {
                return (
                  <>
                    <EventCard key={eventItem._id} title={eventItem.name} imageUrl={eventItem?.thumbnail} />
                  </>
                )
              })}
            </Grid>
          </div>
          <div className={"tab-themes tab-content-item " + (activeTab === 2 ? "current" : "")}>
            <Grid mb='70px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
              {selectedChat?.events.map((eventItem) => {
                return (
                  <>
                    <EventCard key={eventItem._id} title={eventItem.name} imageUrl={eventItem?.thumbnail} />
                  </>
                )
              })}
            </Grid>
          </div>
          <div className={"tab-content-item " + (activeTab === 3 ? "current" : "")}>
            <Grid mb='70px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
              {selectedChat?.events.map((eventItem) => {
                return (
                  <>
                    <EventCard key={eventItem._id} title={eventItem.name} imageUrl={eventItem?.thumbnail} />
                  </>
                )
              })}
            </Grid>
          </div>
        </div>
      </Static>
    </>
  )
}

export default Events