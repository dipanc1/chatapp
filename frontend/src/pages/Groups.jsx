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
  Flex,
  Image,
  UnorderedList,
  useToast,
  Spinner
} from '@chakra-ui/react';

import Static from "../components/common/Static"
import GroupCard from '../components/Groups/GroupCard';
import axios from 'axios';
import { backend_url } from '../baseApi';
import { AppContext } from '../context/AppContext';
import GroupChatModal from '../components/UserModals/GroupChatModal';

function Groups() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [groupsList, setGroupsList] = useState([])
  const [activeTab, setActiveTab] = useState(1)
  const [groupConversations, setGroupConversations] = React.useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  const { userInfo } = React.useContext(AppContext);

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
  }, [toast, user.token, fetchAgain])


  return (
    <>
      <Static>
        <Flex pb={['10px', '30px']} alignItems='center' justifyContent='space-between'>
          <Heading as='h1' size='lg' fontWeight='500'>Groups</Heading>
          <GroupChatModal
            user={userInfo}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          >
            <NavLink className='btn btn-primary'>
              <Flex alignItems='center'>
                <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
                <Text>Create New</Text>
              </Flex>
            </NavLink>
          </GroupChatModal>
        </Flex>


        <UnorderedList ps='0' ms='0' mb='30px' className="tab-nav">
          <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
            All Groups
          </li>
          <li onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
            Joined Groups
          </li>
          <li onClick={() => setActiveTab(3)} className={activeTab === 3 ? "active" : ""}>
            My Groups
          </li>
        </UnorderedList>
        <div className="tab-content">
          <div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>
            {
              groupsList.length ?
                (
                  <Grid className='bg-variants' mb='70px' templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap='2rem' rowGap={['1.5rem', '3rem']}>
                    {groupsList.map((groupItem) => (
                      <GroupCard
                        key={groupItem._id}
                        chatId={groupItem._id}
                        name={groupItem.chatName}
                        members={groupItem.users}
                        admin={groupItem.groupAdmin}
                        upcomingEvents={groupItem.events}
                        isAdmin={userInfo._id === groupItem.groupAdmin._id}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box py='100px' background='transparent' textAlign='center'>
                    <Spinner
                      thickness='4px'
                      speed='0.2s'
                      emptyColor='gray.200'
                      color='buttonPrimaryColor'
                      size='xl'
                    />
                  </Box>
                )
            }
          </div>
          <div className={"tab-themes tab-content-item " + (activeTab === 2 ? "current" : "")}>
            {
              groupConversations.length ?
                (
                  <Grid className='bg-variants' mb='70px' templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap='2rem' rowGap={['1.5rem', '3rem']}>
                    {groupConversations.map((groupItem) => (
                      <GroupCard
                        key={groupItem._id}
                        chatId={groupItem._id}
                        name={groupItem.chatName}
                        members={groupItem.users}
                        upcomingEvents={groupItem.events}
                        isAdmin={userInfo._id === groupItem.groupAdmin._id}
                        admin={groupItem.groupAdmin}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box py='100px' background='transparent' textAlign='center'>
                    <Spinner
                      thickness='4px'
                      speed='0.2s'
                      emptyColor='gray.200'
                      color='buttonPrimaryColor'
                      size='xl'
                    />
                  </Box>
                )
            }
          </div>
          <div className={"tab-themes tab-content-item " + (activeTab === 3 ? "current" : "")}>
            {
              groupConversations.length ?
                (
                  <Grid className='bg-variants' mb='70px' templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap='2rem' rowGap={['1.5rem', '3rem']}>
                    {groupConversations.map((groupItem) => {
                      if (userInfo._id === groupItem.groupAdmin._id) {
                        const adminStatus = true;
                        return (
                          <GroupCard
                            key={groupItem._id}
                            chatId={groupItem._id}
                            name={groupItem.chatName}
                            members={groupItem.users}
                            upcomingEvents={groupItem.events}
                            isAdmin={adminStatus}
                            admin={groupItem.groupAdmin}
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain}
                          />
                        )
                      }
                    }
                    )}
                  </Grid>
                ) : (
                  <Box py='100px' background='transparent' textAlign='center'>
                    <Spinner
                      thickness='4px'
                      speed='0.2s'
                      emptyColor='gray.200'
                      color='buttonPrimaryColor'
                      size='xl'
                    />
                  </Box>
                )
            }
          </div>
        </div>

      </Static>
    </>
  )
}

export default Groups