import Login from "./pages/Login/Login";
import './App.scss';
import Register from "./pages/Register/Register";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat"
import { AnimatePresence } from "framer-motion";

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
