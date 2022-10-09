import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { Box } from '@chakra-ui/react'
import Navbar from '../components/UserChat/Navbar'
import Conversations from '../components/UserChat/Conversations'
import Chatbox from '../components/UserChat/Chatbox'
import Members from '../components/UserChat/Members'
import { AppContext } from '../context/AppContext';
import Streaming from '../components/Miscellaneous/Streaming';
import { MeetingConsumer, MeetingProvider } from '@videosdk.live/react-sdk';
import { SocketContextProvider } from '../context/socketContext';
import { backend_url } from '../baseApi';


const Chat = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { stream } = useContext(AppContext);

  const [fetchAgain, setFetchAgain] = React.useState(false)
  const [meetingId, setMeetingId] = React.useState(null);
  const [token, setToken] = React.useState(null);

  let navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
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
        console.log(e);
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
        .catch((error) => console.log("error", error));
      return response;
    } catch (e) {
      console.log(e);
    }
  };


  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await getMeetingId(token) : id;
    setMeetingId(meetingId);
    console.warn("CHATTTTTTTT APP entry", meetingId, typeof meetingId)
  };

  return (
    <>
      {user.token && <Navbar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      <Box display={'flex'} bg={'backgroundColor'} height={'calc(100vh - 60px)'}>
        {(stream && token && meetingId) ?
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: false,
              webcamEnabled: true,
              name: user.username
            }}
            token={token}
          >
            <MeetingConsumer>
              {() =>
                <Box flex={'9'}>
                  <Streaming meetingId={meetingId} setFetchAgain={setFetchAgain} />
                </Box>
              }
            </MeetingConsumer>
          </MeetingProvider>
          :
          <>
            <Box flex={['0', '2', '2', '2']}>
              {user.token && <Conversations fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
            <SocketContextProvider>
              <Box flex={['12', '7.5', '7.5', '7.5']}>
                {user.token && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} getMeetingAndToken={getMeetingAndToken} />}
              </Box>
            </SocketContextProvider>
          </>
        }
        <Box flex={(stream && token && meetingId) ? '3' : ['0', '2.5', '2.5', '2.5']}>
          {user.token && <Members fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
      </Box>
    </>
  )
}

export default Chat