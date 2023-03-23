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
  const [fetchAgain, setFetchAgain] = React.useState(false);
  const { stream, selectedChat } = useContext(AppContext);

  const [meetingId, setMeetingId] = React.useState(null);
  const [token, setToken] = React.useState(null);

  const admin = selectedChat?.isGroupChat && selectedChat?.groupAdmin._id === user._id;

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
    getToken();
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
        <Static noPadding fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
          <Box overflow={['hidden', 'auto']} position='relative' h={stream ? '' : '100%'} display={'flex'}>
            {stream ?
              <StreamingPeer admin={admin} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              // (stream && token && meetingId) ?
              //   <MeetingProvider
              //     config={{
              //       meetingId,
              //       micEnabled: false,
              //       webcamEnabled: admin ? true : false,
              //       name: user.username
              //     }}
              //     token={token}
              //   >
              //     <MeetingConsumer>
              //       {() =>
              //         <Streaming admin={admin} meetingId={meetingId} setFetchAgain={setFetchAgain} token={token} fetchAgain={fetchAgain} />
              //       }
              //     </MeetingConsumer>
              //   </MeetingProvider>
              :
              <>
                <Box width={['100%', 'auto']} flex={['1', '2', '2', '3']}>
                  {user.token && <Conversations fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                </Box>
                <Box 
                  transform={selectedChat===null ? ["translateX(100%)", 'unset'] : ["translateX(0)", 'unset']} 
                  position={['absolute', 'relative']} 
                  h='100%' 
                  w='100%'
                  flex={['12', '7.5', '7.5', '7.5']}
                  transition="all 0.25s ease-in-out"
                >
                  {user.token && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} getMeetingAndToken={getMeetingAndToken} />}
                </Box>
              </>
            }
            <Box
              h={stream ? 'calc(100vh - 141px)' : '100%'}
              position='sticky'
              top='0'
              flex={(stream && token && meetingId) ? ['0', '3', '3', '3'] : ['0', '5', '5', '4']}
            >
              {user.token && <Members admin={admin} token={token} meetingId={meetingId} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
          </Box>
        </Static>
      </RoomProvider>
    </SocketContextProvider>

  )
}

export default Chat