import Login from "./pages/Login/Login";
import './App.scss';
import Register from "./pages/Register/Register";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="regsiter" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
