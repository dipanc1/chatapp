import './App.scss';
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from './pages/Login'
import Chat from './pages/Chat'
import Register from './pages/Register'

// TODO: add one more tab in mmeebrs and use chat code in there start with video sdk

function App() {

  return (
    <div className="app">
      <AnimatePresence exitBeforeEnter initial={false}>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
