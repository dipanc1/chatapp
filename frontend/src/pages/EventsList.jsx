import React, { useState } from 'react'
import Static from '../components/common/Static'
import axios from 'axios';
import { backend_url } from '../utils';
import { Button, Flex, Heading, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Spinner, Box } from '@chakra-ui/react';

const EventsList = () => {
  const [userData, setUserData] = useState()
  const [pageState, setPageState] = useState({ "page": 1, isLoading: true })

  const user = JSON.parse(localStorage.getItem("user"));

  React.useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const fetchEvents = async () => {
    try {
      pageState["isLoading"] = true;
      setPageState(pageState)
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`${backend_url}/conversation/event/list/5?page=${pageState.page}`, config);
      pageState["page"] = data?.page;
      pageState["pages"] = data?.pages;
      pageState["total"] = data?.total;
      pageState["isLoading"] = false;
      setUserData(data)
      setPageState(pageState)
    } catch (error) {
    }
  }

  const handlePage = (pageNo) => {
    pageState["page"] = pageNo
    setUserData()
    setPageState(pageState)
    fetchEvents()
  }


  const handleEventStatus = async (eventId) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      await axios.put(`${backend_url}/conversation/event/disable/${eventId}`, {}, config);

      setUserData()
      setPageState(pageState)
      fetchEvents()
    } catch (error) {
      console.log(error, ":err23124")
    }
  }

  return (
    <Static>
      <Flex pb={['10px', '30px']} alignItems='center' justifyContent='space-between'>
        <Heading as='h1' size='lg' fontWeight='500'>All Events {pageState?.total && (<>({pageState?.total})</>)}</Heading>
      </Flex>
      {
        pageState.isLoading ? (
          <Flex pt='180px' alignItems={"center"} justifyContent="center">
            <Spinner size={'lg'} color={'primary.300'} />
          </Flex>
        ) : (
          userData?.events.length && (
            <>
              <TableContainer className='table table-striped table-sm'>
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
                      userData.events.map((user, index) => (
                        <>
                          <Tr>
                            <Td>
                              <Flex gap="10px" alignItems="center">
                                <Image height="30px" width="30px" borderRadius="100%" src={user.thumbnail} />
                                <Box>
                                  <Text textTransform="capitalize">{user.name}</Text>
                                </Box>
                              </Flex>
                            </Td>
                            <Td textTransform='capitalize'>{user.description}</Td>
                            <Td>
                              {user.isDisabled ? (
                                <span className="badge expired">Suspended</span>
                              ) : (
                                <span className="badge user-active">Active</span>
                              )}
                            </Td>
                            <Td>{user.date.split('T')[0]}</Td>
                            <Td>{user.time}</Td>
                            <Td>
                              {
                                user.isDisabled ? (
                                  <Button onClick={() => handleEventStatus(user._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className='badge active'>
                                    Unsuspend
                                  </Button>
                                ) : (
                                  <Button onClick={() => handleEventStatus(user._id)} h='fit-content' p='5px 15px!important' fontSize='14px!important' className="badge expired">
                                    Suspend
                                  </Button>
                                )
                              }
                            </Td>
                          </Tr>
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

export default EventsList;