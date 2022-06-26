import React from 'react'
import Chatbox from '../../components/chatBox/Chatbox'
import Conversations from '../../components/conversations/Conversations'
import Members from '../../components/members/Members'
import Navbar from '../../components/navbar/Navbar'
import "./chat.scss"
import { useNavigate } from "react-router-dom";
import { Box } from '@chakra-ui/react'

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
      {user && <Navbar />}
      <Box display={'flex'} bg={'#B4CBFF'} height={'calc(92vh)'}>
        <Box flex={'2.5'}>
          {user && <Conversations fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
        <Box flex={'7.5'}>
          {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
        <Box flex={'2'}>
          {user && <Members fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
      </Box>
    </>
  )
}

export default Chat