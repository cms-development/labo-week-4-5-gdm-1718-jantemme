import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

import Home from './pages/home'
import Admin from './pages/admin'
import Login from './pages/login'
import PostDetail from './pages/postDetail'

function App() {
  let adminLink
  if(localStorage.getItem('userObject'))
    adminLink = <Link to="/admin">Admin</Link>
  else
    adminLink = null
  return (
    <div className="App">
      <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          {adminLink}
        </nav>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/post/:id">
            <PostDetail />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
