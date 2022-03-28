import Login from "./pages/login/Login";
import './App.scss';
import Register from "./pages/register/Register";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat"

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
      {/* <Chat/> */}
    </div>
  );
}

export default App;
