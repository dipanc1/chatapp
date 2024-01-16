import React from 'react'
import Static from '../components/common/Static'
import axios from 'axios';
import { backend_url } from '../utils';
import Cookies from "universal-cookie";

import { Button, Flex, Heading, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Spinner, Box } from '@chakra-ui/react';

const UsersList = () => {
  const [userData, setUserData] = React.useState()
  const [pageState, setPageState] = React.useState({ "page": 1, isLoading: true })

  const cookies = new Cookies();
    const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" });

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
      const { data } = await axios.get(`${backend_url}/users/list/5?page=${pageState.page}`, config);
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
    fetchUsers()
  }

  const handleUserStatus = async (userId) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      await axios.put(`${backend_url}/users/suspend/${userId}`, {}, config);
      setUserData()
      fetchUsers()
    } catch (error) {
      console.log(error, ":err23124")
    }
  }

  return (
    <Static>
      <Flex pb={['10px', '30px']} alignItems='center' justifyContent='space-between'>
        <Heading as='h1' size='lg' fontWeight='500'>All Users {pageState?.total && (<>({pageState?.total})</>)}</Heading>
      </Flex>
      {
        pageState.isLoading ? (
          <Flex pt='180px' alignItems={"center"} justifyContent="center">
            <Spinner size={'lg'} color={'primary.300'} />
          </Flex>
        ) : (
          userData?.users?.length && (
            <>
              <TableContainer className='table table-striped table-sm'>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Status</Th>
                      <Th>Number</Th>
                      <Th>Online</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      userData?.users.map((user, index) => (
                        <Tr>
                          <Td>
                            <Flex gap="10px" alignItems="center">
                              <Image height="30px" width="30px" borderRadius="100%" src={user.pic} />
                              <Box>
                                <Text textTransform="capitalize">{user.username}</Text>
                              </Box>
                            </Flex>
                          </Td>
                          <Td>
                            {user.isSuspended ? (
                              <span className="badge expired">Blocked</span>
                            ) : (
                              <span className="badge user-active">Active</span>
                            )}
                          </Td>
                          <Td>{user.number}</Td>
                          <Td>{user.isOnline ? 'Yes' : 'No'}</Td>
                          <Td>
                            {
                              user.isSuspended ? (
                                <Button onClick={() => handleUserStatus(user._id)} h='fit-content' p='5px 15px!important' fontSize='14px !important' className='badge active'>
                                  Unblock
                                </Button>
                              ) : (
                                <Button onClick={() => handleUserStatus(user._id)} h='fit-content' p='5px 15px!important' fontSize='14px !important' className="badge expired">
                                  Block
                                </Button>
                              )
                            }
                          </Td>
                        </Tr>
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

    </Static>
  )
}

export default UsersList