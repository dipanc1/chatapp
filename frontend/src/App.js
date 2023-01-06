import './global-styles.scss';
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from './pages/Login'
import Chat from './pages/Chat'
import Register from './pages/Register'
import Plans from './pages/Plans'
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import NotFound from './pages/NotFound';

//TODO: delete console statements

function App() {

  return (
    <div>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
