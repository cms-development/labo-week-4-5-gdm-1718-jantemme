import React from 'react';

import styles from '../css/home.module.css'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.getPosts = this.getPosts.bind(this)
        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        this.getPosts()
    }
    

    getPosts = () => {
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODA4MCIsImlhdCI6MTU3MTg0ODI4OCwibmJmIjoxNTcxODQ4Mjg4LCJleHAiOjE1NzI0NTMwODgsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.OM9-o-X6x1RRjKmlWg298RNxoEbo9Z7KCHmm8HfYHac';
        fetch('http://localhost:8080/wp/wp-json/wp/v2/posts', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({
                posts: data
            })
        });
    }

    render() {
        return (
            <div>
                <h1>Posts</h1>
                <div className={styles.container}>
                    {this.state.posts.map(function(post, index){
                        return(
                        <div className={styles.card} key={ index}>
                            <h1 className={styles.cardTitle} key={ index + 1}>{post.title.rendered}</h1>
                            <p className={styles.cardContent} key={ index + 2}>{post.content.rendered}</p>
                        </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}


export default Home
