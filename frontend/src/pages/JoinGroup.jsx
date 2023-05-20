import { Box, Button, Input, Text } from '@chakra-ui/react'
import axios from 'axios';
import React from 'react'
import { backend_url } from '../baseApi';
import { useNavigate, useParams } from 'react-router-dom'

const JoinGroup = () => {
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = React.useState({})
  const navigate = useNavigate();

  React.useEffect(() => {
    try {
      const getGroupDetails = async () => {
        const { data } = await axios.get(`${backend_url}/conversation/encrypted/chat/${groupId}`)

        setGroupDetails(data)

      };
      getGroupDetails();
    } catch (error) {
      console.log(error);
    }

  }, [groupId])

  const joinGroup = async () => {
    navigate(`/join-group/${groupId}/login`)
    localStorage.removeItem('user');
  }

  return (
    <Box h="100vh"
      py={["0", "0", "20px"]}
      px={["0", "0", "30px"]}
      bg="backgroundColor">
      <Box display='flex'
        h='100%'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'>
        <Box
          display='flex'
          justifyContent='center'
          flexDirection='column'
          alignItems='center'
          bg='white'
          borderRadius='lg'
          p='20px'
          boxShadow='lg'
          w='30%'
          maxW='500px'
          h='50%'
        >
          <Text color={"greyTextColor"}>
            {groupDetails?.groupAdmin?.username} invited you to join
          </Text>
          <Text fontSize='3xl' fontWeight='bold' color='buttonPrimaryColor' mt='10px'>
            {groupDetails?.chatName}
          </Text>
          <Text fontSize='lg' fontWeight='bold' color='buttonPrimaryColor' mt='10px'>Group Members:
          </Text>
          <Text color={"greyTextColor"}>
            {groupDetails?.users?.length}
          </Text>
          <Text fontSize='lg' fontWeight='bold' color='buttonPrimaryColor' mt='10px'>Number of Events:
          </Text>
          <Text color={"greyTextColor"}>
            {groupDetails?.events?.length}
          </Text>
          <Button onClick={joinGroup} mt='20px' color='white' bg='buttonPrimaryColor'>Join Group</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default JoinGroup