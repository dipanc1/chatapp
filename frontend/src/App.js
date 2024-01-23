import './global-styles.scss';
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from './pages/Login'
import Register from './pages/Register'
import Plans from './pages/Plans'
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import VideoChat from './pages/VideoChat';
import Groups from './pages/Groups';
import Search from './pages/Search';
import SubscribedSuccessfully from './pages/SubscribedSuccessfully';
import ErrorSubscribing from './pages/ErrorSubscribing';
import JoinGroup from './pages/JoinGroup';
import { Box, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { RoomContext } from './context/RoomContext';
import { AppContext } from './context/AppContext';
import UsersList from './pages/UsersList';
import GroupsList from './pages/GroupsList';
import Dashboard from './pages/Dashboard';
import EventsList from './pages/EventsList';
import Posts from './pages/Posts';
import Contribute from './pages/Contribute';

function App() {
  let isChrome = navigator.userAgentData?.brands?.some(b => b.brand === 'Google Chrome');
  const { cameraPermission } = useContext(RoomContext);
  const { selectedChat } = useContext(AppContext);

  return (
    <div>{
      (!isChrome) ?
        <Box minHeight={'100vh'} minWidth={'100vw'} bg={'buttonPrimaryColor'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
          <Text fontSize={'2xl'} color={'white'}>This website is only supported on Google Chrome</Text>
        </Box>
        : (!cameraPermission) ?
          <Box minHeight={'100vh'} minWidth={'100vw'} bg={'buttonPrimaryColor'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
            <Box w='100%' textAlign='center'>
              <Box fontSize='2xl' fontWeight='bold' mb='2'>Camera Permission Required</Box>
              <Box fontSize='lg' mb='2'>Please allow camera permission to continue</Box>
              <Box fontSize='lg' mb='2'>If you have already allowed camera permission, please refresh the page</Box>
            </Box>
          </Box>
          :
          <AnimatePresence exitBeforeEnter initial={false}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="plans" element={<Plans />} />
              {selectedChat && <>
                <Route path="event" element={<Events />} /><Route path="event/create" element={<CreateEvent />} /><Route path="event/detail" element={<EventDetails />} />
              </>}
              <Route path="settings" element={<Settings />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="user-listing" element={<UsersList />} />
              <Route path="groups-listing" element={<GroupsList />} />
              <Route path="events-listing" element={<EventsList />} />
              <Route path="video-chat" element={<VideoChat />} />
              <Route path="groups" element={<Groups />} />
              <Route path="posts" element={<Posts />} />
              <Route path="search" element={<Search />} />
              <Route path="subscribed-successfully" element={<SubscribedSuccessfully />} />
              <Route path="error-subscribing" element={<ErrorSubscribing />} />
              <Route path="contribute" element={<Contribute />} />
              <Route path="join-group/:groupId" >
                <Route index={true} element={<JoinGroup />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
    }
    </div>
  );
}

export default App;
