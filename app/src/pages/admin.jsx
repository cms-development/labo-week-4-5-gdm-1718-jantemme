import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import styles from '../css/admin.module.css'

import AddPost from './addPost'
import Dashboard from './dashboard'

class Admin extends React.Component {

  componentDidMount = () => {
    if(!localStorage.getItem('userObject'))
      window.location.assign(process.env.REACT_APP_REACT_URL + '/login')
  }
  
  render() {
    return (
      <Router>
        <nav className={styles.navContainer}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/addPost">Add Post</Link>
        </nav>
        <Switch>
          <Route path="/admin/addPost">
            <AddPost />
          </Route>
          <Route path="/admin">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default Admin;
