import Login from "./pages/Login/Login";
import './App.scss';
import Register from "./pages/Register/Register";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat"
import { AnimatePresence } from "framer-motion";

// TODO: start from there also delete styles make app clean, have to create new compoennts for video sharing this won't work

function App() {

  return (
    <div className="app">
      <AnimatePresence exitBeforeEnter initial={false}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
