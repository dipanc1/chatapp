import React, { useState } from 'react'
import Static from '../components/common/Static'
import axios from 'axios';
import { backend_url } from '../utils';
import { Button, Flex, Heading, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Spinner, Box, Input } from '@chakra-ui/react';

const GroupsList = () => {
  const [userData, setUserData] = useState()
  const [pageState, setPageState] = useState({"page": 1, isLoading: true})
  const [activeIndex, setActiveIndex] = useState(-1)
  const [eventsActiveIndex, setEventsActiveIndex] = useState(-1)

  const user = JSON.parse(localStorage.getItem("user"));

  React.useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
    if (activeIndex == groupIndex) {
      setActiveIndex(-1)
    } else {
      setActiveIndex(groupIndex)
    }
  }

  const expandEventsInfo = (groupIndex) => {
    setActiveIndex(-1)
    if (eventsActiveIndex == groupIndex) {
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
      await axios.put(`${backend_url}/conversation/groupsuspend`, {
        chatId
      }, config);

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
      await axios.put(`${backend_url}/conversation/groupmakeadmin`, {
        userId, chatId
      }, config);

      setUserData()
      setPageState(pageState)
      fetchUsers()
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
                      {/* <Th></Th> */}
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
                    {console.log(userData)}
                    {
                      userData.groups.map((user, index) => (
                        <>
                          <Tr>
                            {/* <Td>
                              <Button onClick={() => expandUsersInfo(index)}>+</Button>
                            </Td> */}
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
                            <Td>{user.isOnline ? 'Yes': 'No'}</Td>
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
                            activeIndex == index && (
                              <>
                              <Tr>
                                <Td colspan='12'>
                                  <Box textAlign='right'>
                                    <Input maxW='320px' placeholder='Add Users' py={'13px'} px={['30px', '30px', '21px']} bg={'#F4F1FF'} border={'0'} />
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
                                          <Tr>
                                            <Td>
                                              <Flex gap="10px" alignItems="center">
                                                <Image height="30px" width="30px" borderRadius="100%" src={userInfo.pic} />
                                                <Box>
                                                  <Text textTransform="capitalize">{userInfo.username}</Text>
                                                </Box>
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
                                            <Td>{userInfo.isOnline ? 'Yes': 'No'}</Td>
                                            <Td>
                                              {
                                                user.isSuspeneded ? (
                                                  <Button h='fit-content' p='5px 15px!important' fontSize='14px!important' className='badge active'>
                                                    Unblock
                                                  </Button>
                                                ) : (
                                                  <Button h='fit-content' p='5px 15px!important' fontSize='14px!important' className="badge expired">
                                                    Remove
                                                  </Button>
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
                              </>
                            )
                          }
                          {
                            eventsActiveIndex == index && (
                              user?.events.length ? (
                              
                              <Tr>
                                <Td colSpan='12'>
                                  <Table>
                                    <Thead>
                                      <Tr>
                                        <Th>Event Name</Th>
                                        <Th>Description</Th>
                                        <Th>Status</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {
                                        user?.events.map((event) => (
                                          <Tr>
                                            <Td>{event.name}</Td>
                                            <Td>{event.description}</Td>
                                            <Td>
                                              {event.isDisabled ? (
                                                <span className="badge expired">Inactive</span>
                                              ) : (
                                                <span className="badge user-active">Active</span>
                                              )}
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