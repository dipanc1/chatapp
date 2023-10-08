import React, { useState } from 'react'
import Static from '../components/common/Static'
import axios from 'axios';
import { backend_url } from '../utils';
import { Button, Flex, Heading, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Spinner, Box, Input, useToast, Tooltip, Icon } from '@chakra-ui/react';
import UserCard from '../components/UserItems/UserCard';
import { NotAllowedIcon, StarIcon } from '@chakra-ui/icons';
import conversationApi from '../services/apis/conversationApi';

const GroupsList = () => {
  const [userData, setUserData] = useState()
  const [pageState, setPageState] = useState({ "page": 1, isLoading: true })
  const [activeIndex, setActiveIndex] = useState(-1)
  const [eventsActiveIndex, setEventsActiveIndex] = useState(-1)
  const [usersRemoved, setUsersRemoved] = useState([])
  const [eventsBlocked, setEventsBlocked] = useState([])
  const [eventsAllowed, setEventsAllowed] = useState([])

  const [search, setSearch] = useState('');
  const [searchResultsUsers, setSearchResultsUsers] = useState([]);
  const [searching, setSearching] = useState(false);

  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));

  React.useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = async (e) => {
    setSearching(true);
    setSearch(e.target.value);
    if (e.target.value === '' || e.target.value === null) {
      setSearchResultsUsers([]);
      setSearching(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${backend_url}/users?search=${e.target.value}`,
        config
      );
      setSearchResultsUsers(data.users);
      setSearching(false);

    } catch (error) {
      // console.log(error)
      setSearching(false);
    }
  };

  const handleAddUser = async (user1, groupId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await conversationApi.addToGroup(
        {
          chatId: groupId,
          userId: user1,
        },
        config
      );
      setSearching(true);

      const groupIndex = await userData.groups.findIndex(
        (group) => group._id === groupId
      );
      const newUser = await data.users.find((user) => user._id === user1);
      const userIndex = await userData.groups[groupIndex].users.findIndex((user) => user._id === user1);
      if (userIndex === -1) {
        await userData.groups[groupIndex].users.push(newUser);
      }
      const index = usersRemoved.indexOf(user1);
      if (index > -1) {
        usersRemoved.splice(index, 1);
        setUsersRemoved(usersRemoved => [...usersRemoved])
      }

    } catch (error) {
      // console.log(error)
      toast({
        title: "Error Occured!",
        description: "User already exists in the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

    }
    setSearchResultsUsers([]);
    setSearching(false);
    setSearch("");
  };

  const fetchUsers = async () => {
    try {
      pageState["isLoading"] = true;
      setPageState(pageState)
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`${backend_url}/conversation/list/5?page=${pageState.page}`, config);
      pageState["page"] = data?.page;
      pageState["pages"] = data?.pages;
      pageState["total"] = data?.total;
      pageState["isLoading"] = false;
      data.groups.forEach(obj => {
        obj.isExpanded = false;
      });
      setUserData(data)
      setPageState(pageState)
    } catch (error) {
    }
  }

  const handlePage = (pageNo) => {
    pageState["page"] = pageNo
    setUserData()
    setPageState(pageState)
    fetchUsers()
  }

  const expandUsersInfo = (groupIndex) => {
    setEventsActiveIndex(-1)
    if (activeIndex === groupIndex) {
      setActiveIndex(-1)
    } else {
      setActiveIndex(groupIndex)
    }
  }

  const expandEventsInfo = (groupIndex) => {
    setActiveIndex(-1)
    if (eventsActiveIndex === groupIndex) {
      setEventsActiveIndex(-1)
    } else {
      setEventsActiveIndex(groupIndex)
    }
  }

  const handleGroupStatus = async (chatId) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      await conversationApi.suspendGroup({ chatId }, config);

      setUserData()
      setPageState(pageState)
      fetchUsers()
    } catch (error) {
      console.log(error, ":err23124")
    }
  }

  const handleChangingAdmin = async (userId, chatId) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };

      await conversationApi.changeGroupAdmin({
        userId, chatId
      }, config);

      setUserData()
      toast({
        title: "Admin Updated Successfully!",
        description: "Admin Updated Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setPageState(pageState)
      fetchUsers()
    } catch (error) {
      // console.log(error, ":err23124")
      errorToast("User is already admin!");
    }
  }

  const errorToast = (message) => {
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const removeUser = async (groupId, userId) => {
    try {
      const URL = `${backend_url}/conversation/groupremove`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          "chatId": groupId,
          "userId": userId
        }),
      };
      await fetch(URL, options)
      setUsersRemoved(usersRemoved => [...usersRemoved, userId])
    } catch (e) {
      console.log(e);
      errorToast("Something went wrong");
    }
  }

  const handleEventStatus = async (type, eventId) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      await conversationApi.disableEvent(eventId, config);
      if (type === 'suspend') {
        setEventsBlocked(eventsBlocked => [...eventsBlocked, eventId])
      } else if (type === 'allow') {
        setEventsAllowed(eventsAllowed => [...eventsAllowed, eventId])
      }
      // setUserData()
      // setPageState(pageState)
      // fetchEvents()
    } catch (error) {
      console.log(error, ":err23124")
    }
  }

  return (
    <Static>
      <Flex pb={['10px', '30px']} alignItems='center' justifyContent='space-between'>
        <Heading as='h1' size='lg' fontWeight='500'>All Groups {pageState?.total && (<>({pageState?.total})</>)}</Heading>
      </Flex>
      {
        pageState.isLoading ? (
          <Flex pt='180px' alignItems={"center"} justifyContent="center">
            <Spinner size={'lg'} color={'primary.300'} />
          </Flex>
        ) : (
          userData?.groups.length && (
            <>
              <TableContainer className='table table-striped table-sm'>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Group Name</Th>
                      <Th>Admin</Th>
                      <Th>Status</Th>
                      <Th>Users</Th>
                      <Th>Events</Th>
                      <Th>Online</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      userData.groups.map((user, index) => (
                        <>
                          <Tr>
                            <Td>
                              <Flex gap="10px" alignItems="center">
                                <Image height="30px" width="30px" borderRadius="100%" src={user.pic} />
                                <Box>
                                  <Text textTransform="capitalize">{user.chatName}</Text>
                                </Box>
                              </Flex>
                            </Td>
                            <Td textTransform='capitalize'>{user.groupAdmin.username}</Td>
                            <Td>
                              {user.isSuspended ? (
                                <span className="badge expired">Blocked</span>
                              ) : (
                                <span className="badge user-active">Active</span>
                              )}
                            </Td>
                            <Td cursor='pointer' onClick={() => expandUsersInfo(index)}>
                              <Flex alignItems='center' gap='10px'>
                                {user.users.length} <Image h='18px' src='https://ik.imagekit.io/sahildhingra/down-arrow.png' />
                              </Flex>
                            </Td>
                            <Td cursor='pointer' onClick={() => expandEventsInfo(index)}>
                              <Flex alignItems='center' gap='10px'>
                                {user.events.length} <Image h='18px' src='https://ik.imagekit.io/sahildhingra/down-arrow.png' />
                              </Flex>
                            </Td>
                            <Td>{user.isOnline ? 'Yes' : 'No'}</Td>
                            <Td>
                              {
                                user.isSuspended ? (
                                  <Button onClick={() => handleGroupStatus(user._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className='badge active'>
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button onClick={() => handleGroupStatus(user._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className="badge expired">
                                    Block
                                  </Button>
                                )
                              }
                            </Td>
                          </Tr>
                          {
                            activeIndex === index && (
                              <>
                                <Tr>
                                  <Td colspan='12'>
                                    <Box textAlign='right' position={'relative'}>
                                      <Input focusBorderColor='#9F85F7' onChange={(e) => handleSearch(e)} value={search} maxW='320px' placeholder='Add Users' py={'13px'} px={['30px', '30px', '21px']} bg={'#F4F1FF'} border={'0'} />

                                      {
                                        searching && (
                                          <Box zIndex='1' position='absolute' top={['17px', '2px']} right={['30px', '12px']}>
                                            <Image opacity='0.8' h='35px' src="https://ik.imagekit.io/sahildhingra/search-loading.svg" />
                                          </Box>
                                        )
                                      }
                                      {searchResultsUsers.length > 0 && <Box maxH={'56'} overflowY={'scroll'} p='10px' background='#fff' boxShadow={['unset', '0px 3px 24px rgba(159, 133, 247, 0.6)']} borderRadius='0.5rem' w='17vw' position='absolute' top={'3rem'} right='0' zIndex='1'>
                                        {
                                          searchResultsUsers.map((item) => (
                                            <Box key={item._id} _hover={{ background: '#F4F1FF' }}
                                              borderRadius='1rem'
                                              onClick={() =>
                                                handleAddUser(item._id, user._id)
                                              }
                                            >
                                              <UserCard profileImg={item.pic} userName={item.username} />
                                            </Box>
                                          ))
                                        }
                                      </Box>}
                                    </Box>
                                  </Td>
                                </Tr>
                                <Tr>
                                  <Td colSpan='12'>
                                    <Table>
                                      <Thead>
                                        <Tr>
                                          <Th>User Name</Th>
                                          <Th>Number</Th>
                                          <Th>Status</Th>
                                          <Th>Online</Th>
                                          <Th>Action</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        {
                                          user?.users.map((userInfo) => (
                                            !usersRemoved.includes(userInfo._id) && (
                                              <Tr>
                                                <Td>
                                                  <Flex gap="10px" alignItems="center">
                                                    <Image height="30px" width="30px" borderRadius="100%" src={userInfo.pic} />
                                                    <Box>
                                                      <Text textTransform="capitalize">{userInfo.username}</Text>
                                                    </Box>
                                                    {
                                                      user?.groupAdmin?._id === userInfo?._id && (
                                                        <Tooltip label='Group Admin' fontSize='sm' placement='top' >
                                                          <Button h='fit-content' p='5px 0px!important' fontSize='14px!important' className="badge user-active">
                                                            <Icon as={StarIcon} />
                                                          </Button>
                                                        </Tooltip>
                                                      )
                                                    }
                                                  </Flex>
                                                </Td>
                                                <Td>{userInfo.number}</Td>
                                                <Td>
                                                  {userInfo.isSuspeneded ? (
                                                    <span className="badge expired">Blocked</span>
                                                  ) : (
                                                    <span className="badge user-active">Active</span>
                                                  )}
                                                </Td>
                                                <Td>{userInfo.isOnline ? 'Yes' : 'No'}</Td>
                                                <Td>
                                                  <Flex gap='10px'>
                                                    {
                                                      userInfo.isSuspeneded ? (
                                                        <Button h='fit-content' p='5px 15px!important' fontSize='14px!important' className='badge active'>
                                                          Unblock
                                                        </Button>
                                                      ) : (
                                                        <Tooltip label='Remove User' fontSize='sm' placement='top' >
                                                          <Button onClick={() => removeUser(user._id, userInfo._id)} h='fit-content' p='5px 0px!important' fontSize='14px!important' className="badge expired">
                                                            <Icon as={NotAllowedIcon} />
                                                          </Button>
                                                        </Tooltip>
                                                      )
                                                    }
                                                    {
                                                      user?.groupAdmin?._id !== userInfo?._id && (

                                                        <Tooltip label='Make Admin' fontSize='sm' placement='top' >
                                                          <Button onClick={() => handleChangingAdmin(userInfo._id, user._id)} h='fit-content' p='5px 0px!important' fontSize='14px!important' className="badge active">
                                                            <Icon as={StarIcon} />
                                                          </Button>
                                                        </Tooltip>
                                                      )
                                                    }
                                                  </Flex>
                                                </Td>
                                              </Tr>
                                            )
                                          ))
                                        }
                                      </Tbody>
                                    </Table>
                                  </Td>
                                </Tr>
                              </>
                            )
                          }
                          {
                            eventsActiveIndex === index && (
                              user?.events.length ? (

                                <Tr>
                                  <Td colSpan='12'>
                                    <Table>
                                      <Thead>
                                        <Tr>
                                          <Th>Name</Th>
                                          <Th>Description</Th>
                                          <Th>Status</Th>
                                          <Th>Date</Th>
                                          <Th>Time</Th>
                                          <Th>Action</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        {
                                          user?.events.map((event) => (

                                            <Tr>
                                              <Td>
                                                <Flex gap="10px" alignItems="center">
                                                  <Image height="30px" width="30px" borderRadius="100%" src={event.thumbnail} />
                                                  <Box>
                                                    <Text textTransform="capitalize">{event.name}</Text>
                                                  </Box>
                                                </Flex>
                                              </Td>
                                              <Td textTransform='capitalize'>{event.description}</Td>
                                              <Td>
                                                {event.isDisabled ? (
                                                  <span className="badge expired">Suspended</span>
                                                ) : (
                                                  <span className="badge user-active">Active</span>
                                                )}
                                              </Td>
                                              <Td>{event.date.split('T')[0]}</Td>
                                              <Td>{event.time}</Td>
                                              <Td>
                                                {
                                                  event.isDisabled ? (
                                                    !eventsAllowed.includes(event._id) ? (
                                                      <Button onClick={() => handleEventStatus("allow", event._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className='badge active'>
                                                        Allow
                                                      </Button>
                                                    ) : (
                                                      <Button onClick={() => handleEventStatus("suspend", event._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className="badge expired">
                                                        Suspend
                                                      </Button>
                                                    )
                                                  ) : (
                                                    !eventsBlocked.includes(event._id) ? (
                                                      <Button onClick={() => handleEventStatus("suspend", event._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className="badge expired">
                                                        Suspend
                                                      </Button>
                                                    ) : (
                                                      !eventsAllowed.includes(event._id) ? (
                                                        <Button onClick={() => handleEventStatus("allow", event._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className='badge active'>
                                                          Allow
                                                        </Button>
                                                      ) : (
                                                        <Button onClick={() => handleEventStatus("suspend", event._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className="badge expired">
                                                          Suspend
                                                        </Button>
                                                      )
                                                    )
                                                  )
                                                }
                                              </Td>
                                            </Tr>
                                          ))
                                        }
                                      </Tbody>
                                    </Table>
                                  </Td>
                                </Tr>
                              ) : (
                                <Tr>
                                  <Td colSpan='12'>
                                    <Box py='30px' textAlign='center'>
                                      No Events Hosted
                                    </Box>
                                  </Td>
                                </Tr>
                              )
                            )
                          }
                        </>
                      ))
                    }
                  </Tbody>
                </Table>
              </TableContainer>
              <Flex pt='30px' gap='10px' justifyContent="center" alignItems="center">
                {
                  Array.from({ length: pageState?.pages }, (_, index) => (
                    <Button
                      onClick={() => handlePage(index + 1)}
                      background={pageState?.page === index + 1 ? '#9F85F7' : '#EDF2F7'}
                      color={pageState?.page === index + 1 ? '#fff' : ''}
                    >
                      {index + 1}
                    </Button>
                  ))
                }
              </Flex>
            </>
          )
        )
      }

    </Static >
  )
}

export default GroupsList;