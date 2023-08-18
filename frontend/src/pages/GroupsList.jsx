import React, {useState} from 'react'
import Static from '../components/common/Static'
import axios from 'axios';
import { backend_url } from '../baseApi';
import { Button, Flex, Heading, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Spinner, Box } from '@chakra-ui/react';

const GroupsList = () => {
  const [userData, setUserData] = useState()
  const [pageState, setPageState] = useState({"page": 1, isLoading: true})
  const [activeIndex, setActiveIndex] = useState(-1)

  const user = JSON.parse(localStorage.getItem("user"));

  React.useEffect(() => {
    fetchUsers();
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
      const { data } = await axios.get(`${backend_url}/conversation/all/${pageState.page}`, config);
      pageState["page"] = data?.currentPage;
      pageState["pages"] = data?.totalPages;
      pageState["total"] = data?.totalCount;
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

  const expandGroupInfo = (groupIndex) => {
    if (activeIndex == groupIndex) {
      setActiveIndex(-1)
    } else {
      setActiveIndex(groupIndex)
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
                      <Th></Th>
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
                              <Button onClick={() => expandGroupInfo(index)}>+</Button>
                            </Td>
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
                              {user.isSuspeneded ? (
                                <span className="badge expired">Blocked</span>
                              ) : (
                                <span className="badge user-active">Active</span>
                              )}
                            </Td>
                            <Td>{user.users.length}</Td>
                            <Td>{user.events.length}</Td>
                            <Td>{user.isOnline ? 'Yes': 'No'}</Td>
                            <Td>
                              {
                                user.isSuspeneded ? (
                                  <Button h='fit-content' p='5px 15px!important' fontSize='14px!important' className='badge active'>
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button h='fit-content' p='5px 15px!important' fontSize='14px!important' className="badge expired">
                                    Block
                                  </Button>
                                )
                              }
                            </Td>
                          </Tr>
                          {
                            activeIndex == index && (
                              <Tr>
                                <Td colSpan='12'>
                                  <Table>
                                    <Thead>
                                      <Tr>
                                        <Th>User Name</Th>
                                        <Th>User Name</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {
                                        user?.users.map((userInfo) => (
                                          <Tr>
                                            <Td>{userInfo.username}</Td>
                                            <Td>{userInfo.username}</Td>
                                          </Tr>
                                        ))
                                      }
                                    </Tbody>
                                  </Table>
                                </Td>
                              </Tr>
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

    </Static>
  )
}

export default GroupsList;