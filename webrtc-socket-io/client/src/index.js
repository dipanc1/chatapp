import React from "react";
import ReactDOM from "react-dom";
import { RoomProvider } from "./context/RoomContext";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RoomProvider>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/room/:id" component={Room} />
        </Switch>
      </RoomProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
