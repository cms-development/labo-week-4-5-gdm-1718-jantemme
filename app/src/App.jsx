import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

import Home from './pages/home'
import Login from './pages/login'
import AddPost from './pages/addPost'

function App() {
  return (
    <div className="App">
      <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/addPost">Add post</Link>
          <Link to="/login">Login</Link>
        </nav>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/addPost">
            <AddPost />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
