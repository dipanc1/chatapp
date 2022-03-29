import Login from "./pages/login/Login";
import './App.scss';
import Register from "./pages/register/Register";
import { Switch, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat"

function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/">
          <Login />
        </Route >
        <Route path="/register" exact >
          <Register />
        </Route>
      </Switch>
      {/* <Chat/> */}
    </div>
  );
}

export default App;
