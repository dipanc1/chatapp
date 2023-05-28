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

//TODO: delete console statements

function App() {

  return (
    <div>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="plans" element={<Plans />} />
          <Route path="event" element={<Events />} />
          <Route path="event/create" element={<CreateEvent />} />
          <Route path="event/detail" element={<EventDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="video-chat" element={<VideoChat />} />
          <Route path="groups" element={<Groups />} />
          <Route path="search" element={<Search />} />
          <Route path="subscribed-successfully" element={<SubscribedSuccessfully />} />
          <Route path="error-subscribing" element={<ErrorSubscribing />} />
          <Route path="join-group/:groupId" >
            <Route index={true} element={<JoinGroup />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
