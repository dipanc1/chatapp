import Login from "./pages/login/Login";
import './App.scss';
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat"

function App() {
  return (
    <Router>
      <div className="app">
        {/* <Switch>
          <Route exact path="/">
            <Login />
          </Route >
          <Route exact path="/register"  >
            <Register />
          </Route>
        </Switch> */}
        <Chat/>
      </div>
    </Router>
  );
}

export default App;
