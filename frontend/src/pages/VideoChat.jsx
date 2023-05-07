import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { Box, Flex, useToast } from '@chakra-ui/react'
import Navbar from '../components/UserChat/Navbar'
import Conversations from '../components/UserChat/Conversations'
import Chatbox from '../components/UserChat/Chatbox'
import Members, { MembersComponent } from '../components/UserChat/Members'
import { AppContext } from '../context/AppContext';
import Streaming from '../components/Miscellaneous/Streaming';
import { MeetingConsumer, MeetingProvider } from '@videosdk.live/react-sdk';
import { SocketContextProvider } from '../context/SocketContext';
import { backend_url } from '../baseApi';
import StreamingPeer from '../components/Miscellaneous/StreamingPeerNew';
import { RoomProvider } from '../context/RoomContext';

import Static from "../components/common/Static"


const Chat = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { stream, selectedChat, userInfo } = useContext(AppContext);

  const [meetingId, setMeetingId] = React.useState(null);
  const [fetchAgain, setFetchAgain] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [toggleChat, setToggleChat] = React.useState(false)

  const admin = selectedChat?.isGroupChat && selectedChat?.groupAdmin._id === userInfo._id;

  const toast = useToast();
  let navigate = useNavigate();

  const errorToast = (message) => {
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  React.useEffect(() => {
    if (!user || !user.token) {
      navigate('/');
    }
  }, [navigate, user]);

  React.useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(`${backend_url}/meetings/get-token`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const { token } = await response.json();
        setToken(token);
      } catch (e) {
        // console.log(e);
        errorToast("Something went wrong");
      }
    };
    // getToken();
  }, [])

  const getMeetingId = async (token) => {
    try {
      const VIDEOSDK_API_ENDPOINT = `${backend_url}/meetings/create-meeting`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, region: "in002" }),
      };
      const response = await fetch(VIDEOSDK_API_ENDPOINT, options)
        .then(async (result) => {
          const { meetingId } = await result.json();
          return meetingId;
        })
        .catch((error) => {
          // console.log("error", error);
          errorToast("Something went wrong");
        });
      return response;
    } catch (e) {
      // console.log(e);
      errorToast("Something went wrong");
    }
  };

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await getMeetingId(token) : id;
    setMeetingId(meetingId);
  };

  return (
    <SocketContextProvider>
      <RoomProvider>
        <Static noSmPadding noPadding fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
          <Box overflow={['hidden', 'hidden', 'auto']} position='relative' h={stream ? '100%' : '100%'} display={[!stream ? 'flex' : 'block', 'block', 'flex',]}>
            {stream ?
              <StreamingPeer setToggleChat={setToggleChat} admin={admin} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              :
              <>
                <Box width={['100%', '100%', 'auto']} flex={['1', '1', '2', '3']}>
                  {user.token && <Conversations fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                </Box>
                <Box
                  transform={selectedChat === null ? ["translateX(100%)", "translateX(100%)", 'unset'] : ["translateX(0)", "translateX(0)", 'unset']}
                  position={['absolute', 'absolute', 'relative']}
                  h='100%'
                  w='100%'
                  flex={['12', '12', '7.5', '7.5']}
                  top={['0', '0', 'unset']}
                  transition="all 0.25s ease-in-out"
                >
                  {user.token && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} getMeetingAndToken={getMeetingAndToken} />}
                </Box>
              </>
            }
            <Box
              h={[toggleChat ? stream ? '70%' : '0%' : '0%', toggleChat ? stream ? '70%' : '0%' : '0%', stream ? 'calc(100vh - 141px)' : '100%']}
              overflow='hidden'
              // h={stream ? toggleChat ? ['70%', 'calc(100vh - 141px)'] : 'calc(100vh - 141px)' : '100%'}
              position={['absolute', 'absolute', 'sticky']}
              top={['unset', 'unset', '0']}
              flex={(stream && token && meetingId) ? ['0', '0', '3', '3'] : ['12', '12', '5', '4']}
              zIndex='1'
              bottom={['0', '0', 'unset']}
              width={['100%', '100%', 'auto']}
              transition='all 0.25s ease-in-out'
            // height={['70%', 'auto']}
            >
              {user.token && <Members setToggleChat={setToggleChat} admin={admin} token={token} meetingId={meetingId} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
          </Box>
        </Static>
      </RoomProvider>
    </SocketContextProvider>

  )
}

export default Chat