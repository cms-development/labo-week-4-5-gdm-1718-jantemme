import React from 'react';
import { ClipLoader } from 'react-spinners';

import styles from '../css/dashboard.module.css'

class AddPosts extends React.Component {
    constructor(props) {
        super(props)
        this.getPosts = this.getPosts.bind(this)
        this.state = {
            posts: [],
            loading: false
        }
    }

    componentDidMount() {
        this.getPosts()
    }
    

    removeUserFromLS = () => {
        localStorage.removeItem('userObject')
        window.location.assign(process.env.REACT_APP_REACT_URL); 
    }

    getPosts = () => {
        this.setState({
            loading: true
        })
        fetch(process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/posts', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({
                posts: data,
                loading: false
            })
        });
    }

    deletePost = (e) => {
        const postId = e.target.id
        const token = JSON.parse(localStorage.getItem('userObject')).token

        if(window.confirm("You are about to delete a post. Are you sure? This action is irreversable.")) {
            fetch(process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/posts/' + postId, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            }).then((response) => {
                return response.json();
            }).then(() => {
                window.location.reload(); 
            });
        }
    }

    goToPostDetail = (e) => {
        const postId = e.target.id
        localStorage.setItem('postId', postId)
        window.location.assign(process.env.REACT_APP_REACT_URL + '/post/' + postId); 
     }

    render() {
        let user = {}
        if(user = JSON.parse(localStorage.getItem('userObject')))
            return (
                <div>
                    <h1>Dashboard</h1>
                    <div className={styles.container}>
                        <div className={styles.dashboardContainer}>
                            <h2>Account</h2>
                            <h3>Name:</h3>
                            <p>{user.user_nicename}</p>
                            <h3>Email:</h3>
                            <p>{user.user_email}</p>
                            <button className={styles.button} onClick={this.removeUserFromLS}>Logout</button>
                        </div>
                        <div className={styles.dashboardContainer}>
                            <h2>Creatures</h2>
                            <ClipLoader
                            css={'margin: 0 auto;'}
                            sizeUnit={"px"}
                            size={30}
                            color={'#123abc'}
                            loading={this.state.loading}
                            />
                            {this.state.posts.map((post, index) => {
                                return(
                                <div className={styles.postContainer} key={index}>
                                    <div id={post.id} onClick={this.goToPostDetail}>
                                        <h4 id={post.id} className={styles.cardTitle} key={ index + 1}>{post.title.rendered}</h4>
                                        <p id={post.id} className={styles.cardTitle} key={ index + 2}>{Date(post.date)}</p>
                                    </div>
                                    <h3 id={post.id} onClick={this.deletePost}>&#x2715;</h3>
                                </div>
                                )
                            })}
                        </div>
                    </div>
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
