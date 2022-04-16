import Login from "./pages/Login/Login";
import './App.scss';
import Register from "./pages/Register/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat"

function App() {

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <Login />
          </Route >
          <Route exact path="/register"  >
            <Register />
          </Route>
          <Route exact path="/chat"  >
            <Chat />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
