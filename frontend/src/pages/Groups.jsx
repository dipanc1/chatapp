import React, {
  useState,
  useEffect
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
  Image,
  UnorderedList,
  useToast
} from '@chakra-ui/react';

import Static from "../components/common/Static"
import EventCard from '../components/Events/EventCard';
import GroupCard from '../components/Groups/GroupCard';
import axios from 'axios';
import { backend_url } from '../baseApi';

function Groups() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [groupsList, setGroupsList] = useState([])
  const [activeTab, setActiveTab] = useState(1)
  const [groupConversations, setGroupConversations] = React.useState([]);

  const toast = useToast();

  useEffect(() => {
    // fetch all conversations
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `${backend_url}/conversation`,
          config
        );
        setGroupConversations(
          data.filter((friend) => friend.isGroupChat && friend.chatName)
        );
      } catch (error) {
        // console.log(error)
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Conversations",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    const listGroups = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // 1 is page number, 10 is limit, use it for pagination
      await axios.get(`${backend_url}/conversation/all/1`, config).then(
        (response) => {
          setGroupsList(response.data);
        }).catch((error) => {
          console.log(error)
        })
    }

    fetchChats();
    listGroups();
  }, [toast, user.token])


  return (
    <>
      <Static>
        <Flex pb='30px' alignItems='center' justifyContent='space-between'>
          <Heading as='h1' size='lg' fontWeight='500'>Groups</Heading>
          <NavLink className='btn btn-primary' to="/video-chat">
            <Flex alignItems='center'>
              <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
              <Text>Create New</Text>
            </Flex>
          </NavLink>
        </Flex>


        <UnorderedList ps='0' ms='0' mb='30px' className="tab-nav">
          <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
            All Groups
          </li>
          <li onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
            Joined Groups
          </li>
        </UnorderedList>
        <div className="tab-content">
          <div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>

            <Grid className='bg-variants' mb='70px' templateColumns='repeat(2, 1fr)' gap='2rem' rowGap='3rem'>
              {
                groupsList.map((groupItem) => (
                  <GroupCard
                    key={groupItem._id}
                    name={groupItem.chatName}
                    members={groupItem.users.length}
                    upcomingEvents={groupItem.events.length}
                    isAdmin={user._id === groupItem.groupAdmin._id}
                  />
                ))
              }
            </Grid>
          </div>
          <div className={"tab-themes tab-content-item " + (activeTab === 2 ? "current" : "")}>

            <Grid className='bg-variants' mb='70px' templateColumns='repeat(2, 1fr)' gap='2rem' rowGap='3rem'>
              {
                groupConversations.map((groupItem) => {
                  if (user._id === groupItem.groupAdmin._id) {
                    const adminStatus = true;
                    return (
                      <GroupCard
                        name={groupItem.chatName}
                        members={groupItem.users.length}
                        upcomingEvents={groupItem.events.length}
                        isAdmin={adminStatus}
                      />
                    )
                  }
                  return (
                    <GroupCard
                      name={groupItem.chatName}
                      members={groupItem.users.length}
                      upcomingEvents={groupItem.events.length}
                      isAdmin={false}
                    />
                  )
                })
              }
            </Grid>
          </div>
        </div>

      </Static>
    </>
  )
}

export default Groups