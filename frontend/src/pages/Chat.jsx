import React from 'react'
import { useNavigate } from "react-router-dom";
import { Box } from '@chakra-ui/react'
import Navbar from '../components/UserChat/Navbar'
import Conversations from '../components/UserChat/Conversations'
import Chatbox from '../components/UserChat/Chatbox'
import Members from '../components/UserChat/Members'

const Chat = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  let navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [navigate, user]);

  const [fetchAgain, setFetchAgain] = React.useState(false)

  return (
    <>
      {user && <Navbar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      <Box display={'flex'} bg={'backgroundColor'} height={'calc(100vh - 14)'}>
        {/* <Box flex={['0', '2', '2', '2']}>
          {user && <Conversations fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
        <Box flex={['12', '7.5', '7.5', '7.5']}>
          {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
        <Box flex={['0', '2', '2', '2']}>
          {user && <Members fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box> */}
        <Box bg={'green'} flex={'8'}>
          Streaming
        </Box>
        <Box flex={'4'}>
          {user && <Members fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
      </Box>
    </>
  )
}

export default Chat