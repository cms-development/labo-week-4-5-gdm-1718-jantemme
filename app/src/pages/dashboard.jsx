import React from 'react';

import styles from '../css/addPost.module.css'

class AddPosts extends React.Component {

    render() {
            if(localStorage.getItem('bearerToken'))
            return (
                <div>
                    <h1>Dashboard</h1>
                </div>
            ) 
        else
            return (
                <div>
                    <h1>Dashboard</h1>
                    <div className={styles.container}>
                        <p>Login to view dashboard</p>
                    </div>
                </div>
            )

    }
}


export default AddPosts
